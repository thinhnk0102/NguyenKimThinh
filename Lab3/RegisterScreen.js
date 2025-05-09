import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import Icon from "react-native-vector-icons/MaterialIcons";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    try {
      // Kiểm tra các trường bắt buộc
      if (!email || !password || !confirmPassword || !displayName) {
        Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
        return;
      }

      // Kiểm tra định dạng email
      if (!validateEmail(email)) {
        Alert.alert("Lỗi", "Email không hợp lệ");
        return;
      }

      // Kiểm tra độ dài tên
      if (displayName.length < 2) {
        Alert.alert("Lỗi", "Tên phải có ít nhất 2 ký tự");
        return;
      }

      // Kiểm tra mật khẩu
      if (!validatePassword(password)) {
        Alert.alert(
          "Lỗi",
          "Mật khẩu phải có ít nhất 6 ký tự, bao gồm:\n" +
          "• Chữ hoa\n" +
          "• Chữ thường\n" +
          "• Số\n" +
          "• Ký tự đặc biệt (@$!%*?&)"
        );
        return;
      }

      // Kiểm tra mật khẩu khớp nhau
      if (password !== confirmPassword) {
        Alert.alert("Lỗi", "Mật khẩu không khớp");
        return;
      }

      // Kiểm tra email đã tồn tại trong database
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const emailExists = Object.values(users).some(
          (user) => user.email === email
        );
        if (emailExists) {
          Alert.alert("Lỗi", "Email này đã được sử dụng");
          return;
        }
      }

      // Kiểm tra mã admin nếu đăng ký với vai trò admin
      if (role === "admin") {
        if (!adminCode) {
          Alert.alert("Lỗi", "Vui lòng nhập mã admin");
          return;
        }
        // Kiểm tra mã admin
        if (adminCode !== "ADMIN123") {
          Alert.alert("Lỗi", "Mã admin không chính xác");
          return;
        }
      }

      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Lưu thông tin người dùng vào Realtime Database
      const userRef = ref(db, `users/${userCredential.user.uid}`);
      await set(userRef, {
        displayName: displayName,
        email: email,
        role: role,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Thành công", "Đăng ký thành công!");
      console.log("User registered successfully!", userCredential.user);
      
      // Điều hướng đến HomeLab3
      navigation.replace('HomeLab3');
    } catch (error) {
      let errorMessage = "Đã xảy ra lỗi khi đăng ký";
      
      // Xử lý các mã lỗi cụ thể từ Firebase
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email này đã được sử dụng";
          break;
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Đăng ký bằng email/password không được bật";
          break;
        case "auth/weak-password":
          errorMessage = "Mật khẩu quá yếu";
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert("Lỗi", errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Đăng ký</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon
            name={showConfirmPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Chọn vai trò:</Text>
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "customer" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("customer")}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "customer" && styles.roleButtonTextActive,
              ]}
            >
              Khách hàng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "admin" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("admin")}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "admin" && styles.roleButtonTextActive,
              ]}
            >
              Quản trị viên
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Admin Code Input */}
      {role === "admin" && (
        <TextInput
          style={styles.input}
          placeholder="Nhập mã admin"
          value={adminCode}
          onChangeText={setAdminCode}
          secureTextEntry
        />
      )}

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#f06292",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    padding: 5,
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 5,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "#f06292",
    borderColor: "#f06292",
  },
  roleButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  roleButtonTextActive: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#f06292",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
  },
});

export default RegisterScreen;
