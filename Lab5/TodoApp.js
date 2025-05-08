import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { db } from "../firebaseConfig";
  import { ref, push, onValue, remove, update } from "firebase/database";
  import { MaterialIcons } from '@expo/vector-icons';
  
  export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingTodo, setEditingTodo] = useState(null);
    const [loading, setLoading] = useState(true);
  
    // Fetch todos from Firebase
    useEffect(() => {
      try {
        setLoading(true);
        const todosRef = ref(db, "todos");
        const unsubscribe = onValue(todosRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const todoList = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setTodos(todoList);
          } else {
            setTodos([]);
          }
          setLoading(false);
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching todos:", error);
        Alert.alert("Error", "Failed to load todos");
        setLoading(false);
      }
    }, []);
  
    // Add new todo
    const addTodo = async () => {
      if (newTodo.trim() === "") {
        Alert.alert("Warning", "Please enter a todo");
        return;
      }
  
      try {
        setLoading(true);
        const todosRef = ref(db, "todos");
        await push(todosRef, {
          text: newTodo,
          completed: false,
          createdAt: new Date().toISOString(),
        });
        setNewTodo("");
        Alert.alert("Success", "Todo added successfully!");
      } catch (error) {
        console.error("Error adding todo:", error);
        Alert.alert("Error", "Failed to add todo");
      } finally {
        setLoading(false);
      }
    };
  
    // Delete todo
    const deleteTodo = async (id) => {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this todo?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);
                const todoRef = ref(db, `todos/${id}`);
                await remove(todoRef);
                Alert.alert("Success", "Todo deleted successfully!");
              } catch (error) {
                console.error("Error deleting todo:", error);
                Alert.alert("Error", "Failed to delete todo");
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    };
  
    // Update todo
    const updateTodo = async (id, newText) => {
      if (newText.trim() === "") {
        Alert.alert("Warning", "Todo cannot be empty");
        return;
      }
  
      try {
        setLoading(true);
        const todoRef = ref(db, `todos/${id}`);
        await update(todoRef, {
          text: newText,
          updatedAt: new Date().toISOString(),
        });
        setEditingTodo(null);
        Alert.alert("Success", "Todo updated successfully!");
      } catch (error) {
        console.error("Error updating todo:", error);
        Alert.alert("Error", "Failed to update todo");
      } finally {
        setLoading(false);
      }
    };
  
    // Toggle todo completion
    const toggleTodo = async (id, completed) => {
      try {
        setLoading(true);
        const todoRef = ref(db, `todos/${id}`);
        await update(todoRef, {
          completed: !completed,
          updatedAt: new Date().toISOString(),
        });
        Alert.alert("Success", `Todo marked as ${!completed ? "completed" : "incomplete"}!`);
      } catch (error) {
        console.error("Error toggling todo:", error);
        Alert.alert("Error", "Failed to update todo status");
      } finally {
        setLoading(false);
      }
    };
  
    const renderItem = ({ item }) => (
      <View style={styles.todoItem}>
        {editingTodo === item.id ? (
          <TextInput
            style={styles.editInput}
            value={item.text}
            onChangeText={(text) => updateTodo(item.id, text)}
            onBlur={() => setEditingTodo(null)}
            autoFocus
            placeholder="Edit todo..."
            placeholderTextColor="#666"
          />
        ) : (
          <>
            <TouchableOpacity
              style={styles.todoText}
              onPress={() => toggleTodo(item.id, item.completed)}
            >
              <MaterialIcons 
                name={item.completed ? "check-circle" : "radio-button-unchecked"} 
                size={24} 
                color={item.completed ? "#4CAF50" : "#666"} 
                style={styles.checkIcon}
              />
              <Text
                style={[styles.todoText, item.completed && styles.completedTodo]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
            <View style={styles.todoActions}>
              <TouchableOpacity
                onPress={() => setEditingTodo(item.id)}
                style={[styles.actionButton, styles.editButton]}
              >
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteTodo(item.id)}
                style={[styles.actionButton, styles.deleteButton]}
              >
                <MaterialIcons name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Todo List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="Add new todo..."
            placeholderTextColor="#666"
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity 
            style={[styles.addButton, loading && styles.disabledButton]} 
            onPress={addTodo}
            disabled={loading}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <FlatList
            data={todos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons name="assignment" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No todos yet</Text>
              </View>
            }
          />
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#333",
    },
    inputContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    input: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      paddingHorizontal: 10,
      marginRight: 10,
      backgroundColor: "#fff",
    },
    addButton: {
      backgroundColor: "#007AFF",
      padding: 10,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      width: 50,
    },
    disabledButton: {
      opacity: 0.5,
    },
    list: {
      flex: 1,
    },
    todoItem: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    todoText: {
      flex: 1,
      fontSize: 16,
      color: "#333",
      flexDirection: "row",
      alignItems: "center",
    },
    checkIcon: {
      marginRight: 10,
    },
    completedTodo: {
      textDecorationLine: "line-through",
      color: "#888",
    },
    todoActions: {
      flexDirection: "row",
    },
    actionButton: {
      padding: 8,
      marginLeft: 10,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    editButton: {
      backgroundColor: "#007AFF",
    },
    deleteButton: {
      backgroundColor: "#FF3B30",
    },
    editInput: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      paddingHorizontal: 10,
      marginRight: 10,
      backgroundColor: "#fff",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 50,
    },
    emptyText: {
      marginTop: 10,
      fontSize: 16,
      color: "#666",
    },
  });