import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import AlumniScreen from '../screens/AlumniScreen';
import AlumniFormScreen from '../screens/AlumniFormScreen';
import AlumniDetailScreen from '../screens/AlumniDetailScreen';
import CompanyScreen from '../screens/CompanyScreen';
import CompanyFormScreen from '../screens/CompanyFormScreen';
import JobScreen from '../screens/JobScreen';
import JobFormScreen from '../screens/JobFormScreen';
import JobHistoryScreen from '../screens/JobHistoryScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../constants/theme';

export type RootStackParamList = {
  Tabs: undefined;
  AlumniForm: { alumniId?: string };
  AlumniDetail: { alumniId: string };
  CompanyForm: { companyId?: string };
  JobForm: { jobId?: string; alumniId?: string };
  JobHistory: { alumniId: string };
  Report: undefined;
};

export type TabParamList = {
  DashboardTab: undefined;
  AlumniTab: undefined;
  JobTab: undefined;
  CompanyTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICON: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  DashboardTab: 'grid-outline',
  AlumniTab: 'people-outline',
  JobTab: 'briefcase-outline',
  CompanyTab: 'business-outline',
  ProfileTab: 'person-circle-outline',
};

const TAB_LABEL: Record<keyof TabParamList, string> = {
  DashboardTab: 'Dashboard',
  AlumniTab: 'Alumni',
  JobTab: 'Pekerjaan',
  CompanyTab: 'Perusahaan',
  ProfileTab: 'Profil',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.borderLight,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICON[route.name]} size={size} color={color} />
        ),
        tabBarLabel: TAB_LABEL[route.name],
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardScreen} />
      <Tab.Screen name="AlumniTab" component={AlumniScreen} />
      <Tab.Screen name="JobTab" component={JobScreen} />
      <Tab.Screen name="CompanyTab" component={CompanyScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="AlumniForm" component={AlumniFormScreen} />
        <Stack.Screen name="AlumniDetail" component={AlumniDetailScreen} />
        <Stack.Screen name="CompanyForm" component={CompanyFormScreen} />
        <Stack.Screen name="JobForm" component={JobFormScreen} />
        <Stack.Screen name="JobHistory" component={JobHistoryScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}