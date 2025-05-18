import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import Button from '../components/Button';
import { RootState } from '../services/store';
import { addCompletedSimulation, addXP } from '../services/slices/badgesSlice';

// Simulation scenario type
interface Simulation {
  id: number;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  duration: string;
  completed?: boolean;
}

const ReflexAIScreen = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get completed simulations from Redux store
  const { reflexAICompletedSimulations } = useSelector(
    (state: RootState) => state.badges
  );
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  
  // Simulation data
  const simulations: Simulation[] = [
    {
      id: 1,
      title: t('reflexAI.simulation1'),
      description: 'תרגול תגובה לחבר שנמצא בשקט ומתבודד אחרי החזרה הביתה',
      icon: 'person',
      difficulty: 'easy',
      xpReward: 50,
      duration: '5-7 דקות',
      completed: reflexAICompletedSimulations.includes(1),
    },
    {
      id: 2,
      title: t('reflexAI.simulation2'),
      description: 'תרגול מצב של חבר שמתפרץ בזעם וכיצד להרגיע את המצב',
      icon: 'flame',
      difficulty: 'medium',
      xpReward: 75,
      duration: '8-10 דקות',
      completed: reflexAICompletedSimulations.includes(2),
    },
    {
      id: 3,
      title: t('reflexAI.simulation3'),
      description: 'זיהוי סימני אזהרה אצל חבר שמרבה לבהות במסך ללא תגובה',
      icon: 'eye',
      difficulty: 'hard',
      xpReward: 100,
      duration: '10-12 דקות',
      completed: reflexAICompletedSimulations.includes(3),
    },
  ];
  
  // Open simulation modal
  const handleOpenSimulation = (simulation: Simulation) => {
    setSelectedSimulation(simulation);
    setModalVisible(true);
  };
  
  // Start simulation
  const handleStartSimulation = () => {
    // In a real app, this would start the actual simulation
    setModalVisible(false);
    
    // Simulate completion for demo
    if (selectedSimulation) {
      // Add simulation to completed list
      dispatch(addCompletedSimulation(selectedSimulation.id));
      
      // Award XP
      dispatch(addXP(selectedSimulation.xpReward));
    }
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.error;
      default:
        return colors.grayText;
    }
  };
  
  // Get difficulty label
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'קל';
      case 'medium':
        return 'בינוני';
      case 'hard':
        return 'מאתגר';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Page header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: isDark ? colors.lightText : colors.darkText },
            ]}
          >
            {t('reflexAI.title')}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? colors.grayLight : colors.grayText },
            ]}
          >
            סימולציות לתרגול תגובה לסיטואציות שונות
          </Text>
        </View>

        {/* Simulations list */}
        {simulations.map((simulation) => (
          <TouchableOpacity
            key={simulation.id}
            style={[
              styles.simulationCard,
              {
                backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
                borderColor: simulation.completed 
                  ? colors.success 
                  : isDark ? colors.darkBorder : colors.lightBorder,
                borderWidth: simulation.completed ? 2 : 1,
              },
            ]}
            onPress={() => handleOpenSimulation(simulation)}
          >
            <View style={styles.simulationHeader}>
              <View style={styles.simulationTitleContainer}>
                <View
                  style={[
                    styles.simulationIcon,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons
                    name={simulation.icon as any}
                    size={24}
                    color={colors.lightText}
                  />
                </View>
                
                <View>
                  <Text
                    style={[
                      styles.simulationTitle,
                      { color: isDark ? colors.lightText : colors.darkText },
                    ]}
                  >
                    {simulation.title}
                    {simulation.completed && (
                      <Text style={styles.completedBadge}> ✓</Text>
                    )}
                  </Text>
                  
                  <View style={styles.simulationMeta}>
                    <Text
                      style={[
                        styles.simulationDifficulty,
                        { color: getDifficultyColor(simulation.difficulty) },
                      ]}
                    >
                      {getDifficultyLabel(simulation.difficulty)}
                    </Text>
                    
                    <Text style={styles.simulationDuration}>
                      {simulation.duration}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.simulationXP}>
                +{simulation.xpReward} XP
              </Text>
            </View>
            
            <Text
              style={[
                styles.simulationDescription,
                { color: isDark ? colors.grayLight : colors.grayText },
              ]}
            >
              {simulation.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Simulation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
              },
            ]}
          >
            {selectedSimulation && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={isDark ? colors.lightText : colors.darkText}
                    />
                  </TouchableOpacity>
                  
                  <Text
                    style={[
                      styles.modalTitle,
                      { color: isDark ? colors.lightText : colors.darkText },
                    ]}
                  >
                    {selectedSimulation.title}
                  </Text>
                </View>
                
                <View
                  style={[
                    styles.simulationIconLarge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons
                    name={selectedSimulation.icon as any}
                    size={40}
                    color={colors.lightText}
                  />
                </View>
                
                <Text
                  style={[
                    styles.modalDescription,
                    { color: isDark ? colors.lightText : colors.darkText },
                  ]}
                >
                  {selectedSimulation.description}
                </Text>
                
                <View style={styles.simulationDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>רמת קושי</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: getDifficultyColor(selectedSimulation.difficulty) },
                      ]}
                    >
                      {getDifficultyLabel(selectedSimulation.difficulty)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>משך זמן משוער</Text>
                    <Text style={styles.detailValue}>{selectedSimulation.duration}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>תגמול</Text>
                    <Text style={styles.detailValue}>+{selectedSimulation.xpReward} XP</Text>
                  </View>
                </View>
                
                <Text
                  style={[
                    styles.instructionText,
                    { color: isDark ? colors.grayLight : colors.grayText },
                  ]}
                >
                  בסימולציה זו תצטרך להשתמש בכישורי ההקשבה והתמיכה שלך כדי לסייע בהתמודדות עם מצב רגיש.
                  כל תגובה שלך תשפיע על המשך התרחיש.
                </Text>
                
                <Button
                  title={
                    selectedSimulation.completed
                      ? "תרגל שוב"
                      : t('reflexAI.startSimulation')
                  }
                  onPress={handleStartSimulation}
                  variant="primary"
                  fullWidth
                  style={styles.startButton}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
  },
  simulationCard: {
    borderRadius: borders.radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  simulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  simulationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  simulationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  simulationTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.xs,
  },
  completedBadge: {
    color: colors.success,
    fontWeight: 'bold',
  },
  simulationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simulationDifficulty: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    marginRight: spacing.sm,
  },
  simulationDuration: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.grayText,
  },
  simulationXP: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.md,
    color: colors.accent,
  },
  simulationDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: borders.radius.lg,
    padding: spacing.lg,
    ...shadows.heavy,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  closeButton: {
    marginRight: spacing.md,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    flex: 1,
  },
  simulationIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    alignSelf: 'center',
  },
  modalDescription: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  simulationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.grayText,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
  },
  instructionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  startButton: {
    marginTop: spacing.md,
  },
});

export default ReflexAIScreen; 