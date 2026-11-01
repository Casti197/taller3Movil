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
import { DispatchStudioScreen } from './src/screens/DispatchStudioScreen';

function MainApp() {
  const [activeTab, setActiveTab] = useState<NavTab>('console');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <Header currentTab={activeTab} />
      <View style={styles.screenContainer}>
        {activeTab === 'console' ? <HeroConsoleScreen /> : <DispatchStudioScreen />}
      </View>
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
