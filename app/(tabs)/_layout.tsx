import React from 'react';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              active={require('../../assets/images/tab-map-active.png')}
              inactive={require('../../assets/images/tab-map-inactive.png')}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              active={require('../../assets/images/tab-explore-active.png')}
              inactive={require('../../assets/images/tab-explore-inactive.png')}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              active={require('../../assets/images/tab-profile-active.png')}
              inactive={require('../../assets/images/tab-profile-inactive.png')}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Tab Icon — switches between active and inactive PNG
// ---------------------------------------------------------------------------
type TabIconProps = {
  active: number;
  inactive: number;
  focused: boolean;
};

function TabIcon({ active, inactive, focused }: TabIconProps) {
  return (
    <View style={styles.iconWrapper}>
      <Image
        source={focused ? active : inactive}
        style={styles.icon}
        resizeMode="contain"
      />
      {/* Active indicator dot */}
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    height: 90,
    borderRadius: 20,
    backgroundColor: 'white',
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    paddingTop: 11,
    paddingBottom: 0,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  icon: {
    width: 26,
    height: 26,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34C759',
  },
});