import React, { Component, ReactNode } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  handleReset = () => this.setState({ hasError: false, error: null });
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'red', marginBottom: 10 }}>{this.state.error?.message}</Text>
          <ScrollView style={{ maxHeight: '70%', marginBottom: 20 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{this.state.error?.stack}</Text>
          </ScrollView>
          <TouchableOpacity onPress={this.handleReset} style={{ padding: 12, backgroundColor: '#1B6B4A', borderRadius: 8 }}>
            <Text style={{ color: 'white' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
