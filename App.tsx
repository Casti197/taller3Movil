import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store';
import { theme } from './src/constants/theme';
import { Header } from './src/components/Header';
import { BottomNavBar, NavTab } from './src/components/BottomNavBar';
import { HeroConsoleScreen } from './src/screens/HeroConsoleScreen';
import { StateTreeScreen } from './src/screens/StateTreeScreen';
import { DispatchStudioScreen } from './src/screens/DispatchStudioScreen';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { ArchitectureAcademyScreen } from './src/screens/ArchitectureAcademyScreen';

function MainApp() {
  const [activeTab, setActiveTab] = useState<NavTab>('console');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'console':
        return <HeroConsoleScreen />;
      case 'tree':
        return <StateTreeScreen />;
      case 'dispatch':
        return <DispatchStudioScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'academy':
        return <ArchitectureAcademyScreen />;
      default:
        return <HeroConsoleScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <Header currentTab={activeTab} onNavigateToTree={() => setActiveTab('tree')} />
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MainApp />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  screenContainer: {
    flex: 1,
  },
});
