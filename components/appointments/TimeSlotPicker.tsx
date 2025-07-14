import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface TimeSlotPickerProps {
  doctorId: string;
  onTimeSlotSelect: (date: string, time: string) => void;
}

const mockAvailability = {
  '2024-01-25': ['09:00', '10:30', '14:00', '15:30'],
  '2024-01-26': ['09:30', '11:00', '13:30', '16:00'],
  '2024-01-27': ['10:00', '11:30', '14:30', '16:30'],
  '2024-01-28': ['09:00', '10:00', '15:00', '17:00'],
  '2024-01-29': ['08:30', '10:30', '13:00', '14:30'],
};

export function TimeSlotPicker({ doctorId, onTimeSlotSelect }: TimeSlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const dates = Object.keys(mockAvailability);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onTimeSlotSelect(selectedDate, time);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      {/* Date Selection */}
      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.dateScroll}
        contentContainerStyle={styles.dateScrollContent}
      >
        {dates.map((date) => (
          <TouchableOpacity
            key={date}
            style={[
              styles.dateButton,
              selectedDate === date && styles.dateButtonSelected,
            ]}
            onPress={() => handleDateSelect(date)}
          >
            <Text
              style={[
                styles.dateText,
                selectedDate === date && styles.dateTextSelected,
              ]}
            >
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Selection */}
      {selectedDate && (
        <>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {mockAvailability[selectedDate].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  selectedTime === time && styles.timeButtonSelected,
                ]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextSelected,
                  ]}
                >
                  {formatTime(time)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  dateScroll: {
    marginBottom: Spacing.xl,
  },
  dateScrollContent: {
    paddingRight: Spacing.xl,
  },
  dateButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  dateButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Medium',
    color: Colors.textPrimary,
  },
  dateTextSelected: {
    color: Colors.surface,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  timeButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.gray200,
    minWidth: 100,
    alignItems: 'center',
  },
  timeButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Medium',
    color: Colors.textPrimary,
  },
  timeTextSelected: {
    color: Colors.surface,
  },
});