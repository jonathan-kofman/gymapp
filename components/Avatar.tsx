//components/Avatar.tsx

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, TouchableOpacity, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

interface Props {
  size: number
  url: string | null
  onUpload: (filePath: string) => void
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarSize = { height: size, width: size }

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true)

      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera roll permissions to upload photos.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      })

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.')
        return
      }

      const image = result.assets[0]
      console.log('Got image', image)

      if (!image.uri) {
        throw new Error('No image uri!')
      }

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())
      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
      const path = `${Date.now()}.${fileExt}`

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        })

      if (uploadError) {
        throw uploadError
      }

      onUpload(data.path)
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Upload Error', error.message)
      } else {
        throw error
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={uploadAvatar} disabled={uploading}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            accessibilityLabel="Avatar"
            style={[avatarSize, styles.avatar, styles.image]}
          />
        ) : (
          <View style={[avatarSize, styles.avatar, styles.noImage]}>
            <Text style={styles.noImageText}>+</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={uploadAvatar} 
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>
          {uploading ? 'Uploading...' : 'Change Photo'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    resizeMode: 'cover',
  },
  noImage: {
    backgroundColor: '#e1e1e1',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 40,
    color: '#999',
    fontWeight: '300',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
})