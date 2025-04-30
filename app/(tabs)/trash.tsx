import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Col, Grid } from 'react-native-easy-grid';

const Trash = () => {
  const [trash, setTrash] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  // Load trash and notes from AsyncStorage
  useEffect(() => { 
    const loadData = async () => {
      const storedTrash = await AsyncStorage.getItem('trash');
      const storedNotes = await AsyncStorage.getItem('notes');

      if (storedTrash) setTrash(JSON.parse(storedTrash));
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    };

    loadData();
  }, []);

  const saveTrash = async (updatedTrash: any[]) => {
    setTrash(updatedTrash);
    await AsyncStorage.setItem('trash', JSON.stringify(updatedTrash));
  };

  const saveNotes = async (updatedNotes: any[]) => {
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const handleNoteAction = (index: number) => {
    Alert.alert(
      'Note Options',
      'What do you want to do with this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: async () => {
            const updatedTrash = trash.filter((_, i) => i !== index);
            await saveTrash(updatedTrash);
          },
          
        },
        {
          text: 'Restore',
          onPress: async () => {
            const noteToRestore = trash[index];
            const updatedTrash = trash.filter((_, i) => i !== index);
            const updatedNotes = [noteToRestore, ...notes];

            await saveTrash(updatedTrash);
            await saveNotes(updatedNotes);
          },
        },
      ]
    );
  };


  const columnOneNotes = trash.filter((_, i) => i % 2 === 0);
  const columnTwoNotes = trash.filter((_, i) => i % 2 !== 0);
  return (

    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <View>
        <Grid style={{ gap: 5, padding: 5 }}>
          <Col>
            {columnOneNotes.map((note, index) => (
              <View key={note.id || index} style={[styles.note, { backgroundColor: note.color }]}>
                <TouchableOpacity style={{ gap: 7 }} onPress={() => handleNoteAction(index)} >
                  {note.title ? (<Text style={{ fontWeight: 'bold', color: '#000' }}>{note.title}</Text>) : ''}
                  <Text style={{ color: '#000' }}>{note.content}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Col>
          <Col>
            {columnTwoNotes.map((note, index) => (

              <View key={note.id || index} style={[styles.note, { backgroundColor: note.color }]}>
                <TouchableOpacity onPress={() => handleNoteAction(index)}>
                  <Text style={{ fontWeight: 'bold', color: '#000' }}>{note.title}</Text>
                  <Text style={{ color: '#000' }}>{note.content}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Col>
        </Grid>

      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' },
  noteItem: { marginBottom: 20, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 10 },
  noteTitle: { fontSize: 18, fontWeight: 'bold' },
  noteContent: { fontSize: 16, color: '#555', marginBottom: 10 },
  note: {
    width: '100%',
    maxHeight: 200,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',

  },
});

export default Trash;
