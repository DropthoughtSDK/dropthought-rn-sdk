import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  // @ts-ignore
  SurveyModalContainer,
  // @ts-ignore
  useOpenSurvey,
  initialize,
  feedbackUploader,
} from '@dropthought/react-native-dt-sdk';

const API_KEY = '';
const VISIBILITY_ID = '';

initialize({
  apiKey: API_KEY,
  // @ts-ignore
  storage: AsyncStorage,
});

export default function App() {
  return (
    <SurveyModalContainer>
      <TestView />
    </SurveyModalContainer>
  );
}

function TestView() {
  const openSurvey = useOpenSurvey();

  const [apiKey, setApiKey] = useState(API_KEY);
  const [visibilityId, setVisibilityId] = useState(VISIBILITY_ID);

  const eux = (
    <View style={styles.flex1}>
      <Text style={styles.title}>{'Visibility ID:'}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.textInput}
          onChangeText={id => setVisibilityId(id.trim())}
          value={visibilityId}
        />
      </View>
    </View>
  );

  return (
    <View
      style={
        Platform.OS === 'android' ? styles.containerAndroid : styles.container
      }>
      <Text style={styles.title}>{'API Key:'}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.textInput}
          onChangeText={newApiKey => setApiKey(newApiKey.trim())}
          value={apiKey}
        />
      </View>
      {eux}
      <TouchableOpacity
        style={styles.showSurveyButton}
        onPress={() => {
          openSurvey({
            apiKey,
            visibilityId,
          });
        }}>
        <Text style={styles.showSurveyTitle}>{'Show Survey'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => feedbackUploader.upload()}>
        <Text style={styles.showSurveyTitle}>{'Upload Offline Feedback'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
    backgroundColor: '#eceff4',
  },
  containerAndroid: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#eceff4',
  },
  textInput: {
    backgroundColor: 'white',
    width: '100%',
    fontSize: 13,
    fontWeight: 'bold',
    borderRadius: 4,
    paddingLeft: 5,
    color: 'black',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    minHeight: 30,
  },
  showSurveyButton: {
    marginBottom: 10,
    backgroundColor: '#544aa1',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  showSurveyTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 15,
  },
  uploadButton: {
    backgroundColor: '#544aa1',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 4,
    marginHorizontal: 10,
    marginBottom: 30,
  },
});
