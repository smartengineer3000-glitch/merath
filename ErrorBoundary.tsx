import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'red' }}>Something went wrong</Text>
          <Text>{this.state.error?.message}</Text>
          <TouchableOpacity onPress={this.handleReset} style={{ padding: 12, backgroundColor: '#1B6B4A', borderRadius: 8, marginTop: 20 }}>
            <Text style={{ color: 'white' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
