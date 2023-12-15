import React, { type PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';

function MissingIcon({
  color,
  backgroundColor,
  size,
  children,
}: PropsWithChildren<{
  color: string;
  backgroundColor: string;
  size: number;
}>) {
  return (
    <View style={[styles.icon, { backgroundColor, width: size, height: size }]}>
      <Text style={[{ color, fontSize: size / 1.8, lineHeight: size }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MissingIcon;
