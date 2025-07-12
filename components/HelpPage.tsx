import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpPageProps {
  onBack: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I book a trainer?',
      answer: 'To book a trainer, simply browse the available trainers in your area, select one that matches your fitness goals, and tap "Book Now" to schedule your session. You can choose your preferred date and time from the trainer\'s available slots.',
      category: 'Booking'
    },
    {
      id: '2',
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Yes, you can cancel or reschedule your booking up to 24 hours before your scheduled session. Go to "My Bookings" in your profile to manage your appointments.',
      category: 'Booking'
    },
    {
      id: '3',
      question: 'What if I need to cancel last minute?',
      answer: 'Cancellations within 24 hours of your session may incur a cancellation fee. Please contact your trainer directly for urgent cancellations.',
      category: 'Booking'
    },
    {
      id: '4',
      question: 'How do I pay for my sessions?',
      answer: 'Payment is processed securely through the app when you book your session. We accept all major credit cards, debit cards, and digital wallets.',
      category: 'Payment'
    },
    {
      id: '5',
      question: 'What if I\'m not satisfied with my trainer?',
      answer: 'We want you to have the best experience possible. If you\'re not satisfied, please contact our support team within 24 hours of your session for a full refund or trainer replacement.',
      category: 'Support'
    },
    {
      id: '6',
      question: 'How do I update my fitness goals?',
      answer: 'You can update your fitness goals in your profile settings. Go to Profile > Edit and modify your fitness information to help trainers better understand your needs.',
      category: 'Account'
    },
    {
      id: '7',
      question: 'Is my personal information secure?',
      answer: 'Yes, we take your privacy seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent.',
      category: 'Privacy'
    },
    {
      id: '8',
      question: 'What should I bring to my first session?',
      answer: 'Bring comfortable workout clothes, water, and any specific equipment your trainer requests. Most gyms provide basic equipment, but check with your trainer beforehand.',
      category: 'Sessions'
    }
  ];

  const categories = ['All', 'Booking', 'Payment', 'Support', 'Account', 'Privacy', 'Sessions'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const handleFAQPress = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact us?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email Support', onPress: () => Alert.alert('Email', 'support@trainerx.com') },
        { text: 'Live Chat', onPress: () => Alert.alert('Live Chat', 'Live chat would open here.') },
        { text: 'Call Us', onPress: () => Alert.alert('Call', '+1 (555) 123-4567') },
      ]
    );
  };

  const handleReportIssue = () => {
    Alert.alert('Report Issue', 'Issue reporting form would open here.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={handleContactSupport}>
              <Text style={styles.quickActionText}>Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={handleReportIssue}>
              <Text style={styles.quickActionText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.activeCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ List */}
        <View style={styles.section}>
          {filteredFAQs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => handleFAQPress(faq.id)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Text style={styles.expandIcon}>
                  {expandedFAQ === faq.id ? '−' : '+'}
                </Text>
              </TouchableOpacity>
              {expandedFAQ === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email Support:</Text>
            <Text style={styles.contactValue}>support@trainerx.com</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Phone Support:</Text>
            <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Hours:</Text>
            <Text style={styles.contactValue}>Monday - Friday: 9AM - 6PM EST</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Response Time:</Text>
            <Text style={styles.contactValue}>Within 24 hours</Text>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>December 2024</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Platform:</Text>
            <Text style={styles.infoValue}>iOS & Android</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#000',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeCategoryButtonText: {
    color: '#FFF',
  },
  faqItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    marginRight: 16,
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  faqAnswer: {
    marginTop: 12,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
});

export default HelpPage; 