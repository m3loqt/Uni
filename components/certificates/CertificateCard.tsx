import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Download, Calendar, User } from 'lucide-react-native';

interface CertificateCardProps {
  id: string;
  title: string;
  issueDate: string;
  expiryDate: string;
  doctorName: string;
  type: 'fitness' | 'vaccination' | 'leave';
  onPress: () => void;
  onDownload: () => void;
}

export function CertificateCard({
  title,
  issueDate,
  expiryDate,
  doctorName,
  type,
  onPress,
  onDownload,
}: CertificateCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'fitness':
        return '#10B981';
      case 'vaccination':
        return '#3B82F6';
      case 'leave':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const isExpiringSoon = () => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = () => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${getTypeColor()}20` }]}>
          <FileText size={24} color={getTypeColor()} />
        </View>
        <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
          <Download size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.infoRow}>
        <User size={14} color="#6B7280" />
        <Text style={styles.infoText}>{doctorName}</Text>
      </View>
      
      <View style={styles.dateRow}>
        <Calendar size={14} color="#6B7280" />
        <Text style={styles.dateText}>Issued: {issueDate}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.expiryText}>Expires: {expiryDate}</Text>
        {isExpired() && (
          <View style={styles.expiredBadge}>
            <Text style={styles.expiredText}>Expired</Text>
          </View>
        )}
        {isExpiringSoon() && !isExpired() && (
          <View style={styles.expiringSoonBadge}>
            <Text style={styles.expiringSoonText}>Expiring Soon</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  expiredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#EF4444',
  },
  expiredText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  expiringSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
  },
  expiringSoonText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textTransform: 'uppercase',
  },
});