import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Calculator() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [currentNumber, setCurrentNumber] = useState("");
  const [lastNumber, setLastNumber] = useState("");
  const [operation, setOperation] = useState("");
  const [displayFormula, setDisplayFormula] = useState("");
  const [result, setResult] = useState("");

  // Tính toán kết quả
  const handleCalculation = () => {
    if (!currentNumber && !lastNumber) return;

    let calculationResult = 0;

    switch (operation) {
      case "+":
        calculationResult = parseFloat(lastNumber) + parseFloat(currentNumber);
        break;
      case "-":
        calculationResult = parseFloat(lastNumber) - parseFloat(currentNumber);
        break;
      case "*":
        calculationResult = parseFloat(lastNumber) * parseFloat(currentNumber);
        break;
      case "/":
        calculationResult = parseFloat(lastNumber) / parseFloat(currentNumber);
        break;
      default:
        return;
    }

    setResult(calculationResult.toString());
    setLastNumber(calculationResult.toString());
    setCurrentNumber("");
    setOperation("");
    setDisplayFormula(calculationResult.toString());
  };

  // Xử lý khi nhấn nút số
  const handleNumberPress = (buttonValue) => {
    if (result !== "") {
      setResult("");
      setDisplayFormula("");
    }
    setCurrentNumber(currentNumber + buttonValue);
  };

  // Xử lý khi nhấn nút phép tính
  const handleOperationPress = (operationValue) => {
    if (currentNumber === "" && lastNumber === "") return;

    if (currentNumber !== "") {
      setLastNumber(currentNumber);
      setCurrentNumber("");
      setOperation(operationValue);
      setDisplayFormula(`${currentNumber}${operationValue}`);
    } else if (lastNumber !== "") {
      setOperation(operationValue);
      setDisplayFormula(`${lastNumber}${operationValue}`);
    }
  };

  // Xử lý khi nhấn nút xóa (C)
  const handleClear = () => {
    setCurrentNumber("");
    setLastNumber("");
    setOperation("");
    setDisplayFormula("");
    setResult("");
  };

  // Xử lý khi nhấn nút xóa một ký tự (DEL)
  const handleDelete = () => {
    setCurrentNumber(currentNumber.slice(0, -1));
  };

  // Định dạng màu cho các nút
  const colors = {
    light: {
      background: "#f5f5f5",
      text: "#212121",
      operatorBackground: "#00bcd4",
      operatorText: "#ffffff",
      buttonBackground: "#e0e0e0",
      resultText: "#00bcd4",
      displayBackground: "#ffffff",
    },
    dark: {
      background: "#212121",
      text: "#ffffff",
      operatorBackground: "#00bcd4",
      operatorText: "#ffffff",
      buttonBackground: "#323232",
      resultText: "#00bcd4",
      displayBackground: "#1e1e1e",
    },
  };

  const theme = darkTheme ? colors.dark : colors.light;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={darkTheme ? "light-content" : "dark-content"} />

      <TouchableOpacity
        style={styles.themeToggle}
        onPress={() => setDarkTheme(!darkTheme)}
      >
        {darkTheme ? (
          <Feather name="sun" size={24} color="#ccc" />
        ) : (
          <Feather name="moon" size={24} color="#333" />
        )}
      </TouchableOpacity>

      <View
        style={[styles.display, { backgroundColor: theme.displayBackground }]}
      >
        <Text style={[styles.formula, { color: theme.text }]}>
          {displayFormula}
        </Text>
        <Text style={[styles.result, { color: theme.resultText }]}>
          {result || (currentNumber ? currentNumber : "0")}
        </Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {/* Row 1 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleClear()}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleDelete()}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>DEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.operatorBackground },
            ]}
            onPress={() => handleOperationPress("/")}
          >
            <Text style={[styles.buttonText, { color: theme.operatorText }]}>
              /
            </Text>
          </TouchableOpacity>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress("7")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress("8")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress("9")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.operatorBackground },
            ]}
            onPress={() => handleOperationPress("*")}
          >
            <Text style={[styles.buttonText, { color: theme.operatorText }]}>
              *
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress("4")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress("5")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress("6")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.operatorBackground },
            ]}
            onPress={() => handleOperationPress("-")}
          >
            <Text style={[styles.buttonText, { color: theme.operatorText }]}>
              -
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress("1")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress("2")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress("3")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.operatorBackground },
            ]}
            onPress={() => handleOperationPress("+")}
          >
            <Text style={[styles.buttonText, { color: theme.operatorText }]}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.zeroButton,
              { backgroundColor: theme.buttonBackground },
            ]}
            onPress={() => handleNumberPress("0")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackground }]}
            onPress={() => handleNumberPress(".")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.operatorBackground },
            ]}
            onPress={() => handleCalculation()}
          >
            <Text style={[styles.buttonText, { color: theme.operatorText }]}>
              =
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  display: {
    flex: 2,
    padding: 20,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  formula: {
    fontSize: 18,
    marginBottom: 10,
  },
  result: {
    fontSize: 40,
    fontWeight: "bold",
  },
  keypad: {
    flex: 3,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  button: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  zeroButton: {
    flex: 2,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "500",
  },
});