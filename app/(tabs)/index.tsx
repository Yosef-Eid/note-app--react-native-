import React, { useState, useEffect } from 'react';
import {
  Text, View, TextInput, TouchableOpacity,
  Modal, StyleSheet, Alert,
  ScrollView, Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Col, Grid } from 'react-native-easy-grid';

type Note = {
  id?: string;
  title: string;
  content: string;
  color: string;
  index?: number;
};

type TrashNote = Note;

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalColor, setShowModalColor] = useState<boolean>(false);
  const [currentNote, setCurrentNote] = useState<Note>({ title: '', content: '', color: '#ffffff' });
  const [trash, setTrash] = useState<TrashNote[]>([]);

  const openModal = () => {
    setShowModalColor(true);
  };

  // دالة لإغلاق الموديل
  const closeModal = () => {
    setShowModalColor(false);
  };

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await AsyncStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }

        const savedTrash = await AsyncStorage.getItem('trash'); // 🔄 تحميل المحذوفات
        if (savedTrash) {
          setTrash(JSON.parse(savedTrash));
        }
      } catch (error) {
        console.error('Failed to load notes from AsyncStorage', error);
      }
    };

    loadNotes();
  }, []);

  const saveNotesToAsyncStorage = async (notes: Note[]) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes to AsyncStorage', error);
    }
  };

  const openEditModal = (note: Note, index: number) => {
    setCurrentNote({ ...note, index });
    setShowModal(true);
  };


  const handleSaveNote = () => {
    if (currentNote.index === undefined) return;
    const updatedNotes = [...notes];
    updatedNotes[currentNote.index] = {
      title: currentNote.title,
      content: currentNote.content,
      color: currentNote.color,
    };
    setNotes(updatedNotes);
    saveNotesToAsyncStorage(updatedNotes);
    setShowModal(false);
  };

  const handleAddNote = () => {
    const newNote: Note = { title: '', content: '', color: '#ffffff' };
    setCurrentNote(newNote);
    setShowModal(true);
  };

  const handleSaveNewNote = () => {
    const updatedNotes = [currentNote, ...notes];
    setNotes(updatedNotes);
    saveNotesToAsyncStorage(updatedNotes);
    setShowModal(false);
  };

  const handleBackPress = () => {
    if (currentNote.content.trim() === '') {
      setShowModal(false);
      return;
    }
    if (currentNote.index !== undefined) {
      handleSaveNote();
    } else {
      handleSaveNewNote();
    }
  }

  const saveTrashToAsyncStorage = async (trashNotes: TrashNote[]) => {
    try {
      await AsyncStorage.setItem('trash', JSON.stringify(trashNotes));
    } catch (error) {
      console.error('Failed to save trash', error);
    }
  };
  const handleDeleteNote = (index: number) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const noteToDelete = notes[index];
            const updatedNotes = notes.filter((_, i) => i !== index);
            const updatedTrash = [noteToDelete, ...trash];


            setShowModal(false);
            setTrash(updatedTrash);
            setNotes(updatedNotes);
            saveTrashToAsyncStorage(updatedTrash);
            saveNotesToAsyncStorage(updatedNotes);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const columnOneNotes = notes.filter((_, i) => i % 2 === 0);
  const columnTwoNotes = notes.filter((_, i) => i % 2 !== 0);


  const colors = [
    '#b4ddd3',
    '#f39f76',
    '#fff8b8',
    '#e2f6d3',
    '#b4ddd3',
    '#d4e4ed',
    '#aeccdc',
    '#d3bfdb',
    '#f6e2dd',
    '#e9e3d4'
  ]


  return (

    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View>
          <Grid style={styles.appNote}>
            <Col>
              {columnOneNotes.map((note, index) => (
                <View key={note.id || index} style={[styles.note, { backgroundColor: note.color }]}>
                  <TouchableOpacity style={{ gap: 7 }} onPress={() => openEditModal(note, notes.indexOf(note))}>
                    {note.title ? (<Text style={{ fontWeight: 'bold', color: '#000' }}>{note.title}</Text>) : ''}
                    <Text style={{ color: '#000' }}>{note.content}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Col>
            <Col>
              {columnTwoNotes.map((note, index) => (

                <View key={note.id || index} style={[styles.note, { backgroundColor: note.color }]}>
                  <TouchableOpacity onPress={() => openEditModal(note, notes.indexOf(note))}>
                    <Text style={{ fontWeight: 'bold', color: '#000' }}>{note.title}</Text>
                    <Text style={{ color: '#000' }}>{note.content}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Col>
          </Grid>

        </View>
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent
        onRequestClose={handleBackPress}>
        <View style={styles.modalContainer}>
          <View style={[styles.modal, { backgroundColor: currentNote.color }]}>
            <ScrollView keyboardShouldPersistTaps="handled" >
              <TextInput
                style={styles.inputTitle}
                placeholder="Title"
                value={currentNote.title}
                onChangeText={(text) => setCurrentNote({ ...currentNote, title: text })}
              />

              <TextInput
                style={styles.inputText}
                placeholder="Enter your note..."
                multiline
                textAlignVertical="top"
                value={currentNote.content}
                onChangeText={(text) => setCurrentNote({ ...currentNote, content: text })}
              />

              <View style={{ minHeight: 150, width: '100%' }}></View>

            </ScrollView>

            <View style={styles.colorContainer}>
              <View style={{
                width: '100%',
                paddingInline: 40,
                gap: 10,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
                <Ionicons name="ellipsis-vertical" onPress={() => {
                  handleDeleteNote(currentNote.index!);

                }}
                  style={{
                    transform: [{ scale: 2 }],
                  }}
                ></Ionicons>

                <Ionicons name="color-palette" style={{
                  transform: [{ scale: 2 }],
                }} onPress={openModal}></Ionicons>

              </View>
              <Modal onRequestClose={closeModal}
                visible={showModalColor} animationType="slide" transparent>

                <TouchableWithoutFeedback onPress={closeModal}>
                  <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }} />
                </TouchableWithoutFeedback>

                <View style={styles.modalColor}>
                  {
                    colors.map((index, kay) => (
                      <TouchableOpacity key={kay}
                        style={[styles.colorButton, { backgroundColor: index }]}
                        onPress={() => setCurrentNote({ ...currentNote, color: index })}
                      />
                    ))
                  }

                </View>
              </Modal>
            </View>
          </View>
        </View>
      </Modal>

      {/* add note */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
        <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  modalColor: {
    width: '100%',
    // height: '20%',
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    boxShadow: '0 0 20px 5px rgba(0, 0, 0, 0.1)'
  },
  appNote: {
    width: '100%',
    minHeight: '100%',
    gap: 5,
    padding: 7,
  },
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: 'black',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    width: '100%',
    height: '100%',
    gap: 1,
    justifyContent: 'space-between',
  },
  inputTitle: {
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  inputText: {
    minHeight: Dimensions.get('window').height * 0.88,
    // backgroundColor:'red',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    textAlignVertical: 'top',
  },

  colorContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.09)',
    boxShadow: '0 0 20px 0px rgba(0, 0, 0, 0.07)'
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'gray',
    margin: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    width: '100%',
    color: 'white',
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 17,
  },
  moreButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  moreButtonText: {
    fontSize: 18,
    color: '#000',
  },
});


