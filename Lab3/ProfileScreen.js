import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAuth, signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail } from 'firebase/auth';
import { getDatabase, ref, onValue, update, get } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config/cloudinaryConfig';

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    displayName: '',
    phone: '',
    address: '',
  });

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserInfo(data);
          setEditedInfo({
            displayName: data.displayName || '',
            phone: data.phone || '',
            address: data.address || '',
          });
        } else {
          setUserInfo({ displayName: user.email });
          setEditedInfo({
            displayName: user.email,
            phone: '',
            address: '',
          });
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
      console.error(error);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        const userRef = ref(db, `users/${user.uid}`);
        await update(userRef, {
          avatarURL: data.secure_url
        });

        Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công');
      } else {
        throw new Error('Không thể upload ảnh lên Cloudinary');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        displayName: editedInfo.displayName,
        phone: editedInfo.phone,
        address: editedInfo.address,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.navigate('Login');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
            }
          }
        }
      ]
    );
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Alert.alert(
        "Thành công", 
        "Mật khẩu đã được thay đổi thành công",
        [
          {
            text: "OK",
            onPress: () => {
              setShowChangePassword(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setShowCurrentPassword(false);
              setShowNewPassword(false);
              setShowConfirmPassword(false);
            }
          }
        ]
      );
    } catch (error) {
      let errorMessage = 'Không thể thay đổi mật khẩu';
      
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại';
          break;
        case 'auth/weak-password':
          errorMessage = 'Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Quá nhiều yêu cầu thay đổi mật khẩu. Vui lòng thử lại sau';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert("Lỗi", errorMessage);
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      Alert.alert("Lỗi", "Vui lòng nhập email của bạn");
      return;
    }

    try {
      setLoading(true);
      
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      const users = snapshot.val();
      
      let emailExists = false;
      if (users) {
        Object.values(users).forEach(user => {
          if (user.email === resetEmail) {
            emailExists = true;
          }
        });
      }

      if (!emailExists) {
        Alert.alert("Lỗi", "Email chưa được đăng ký trong hệ thống");
        return;
      }

      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert(
        "Thành công",
        "Link thay đổi mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra email và làm theo hướng dẫn.",
        [
          {
            text: "OK",
            onPress: () => {
              setShowForgotPassword(false);
              setShowChangePassword(false);
              setResetEmail("");
            }
          }
        ]
      );
    } catch (error) {
      let errorMessage = "Không thể gửi email đặt lại mật khẩu";
      
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ";
          break;
        case "auth/user-not-found":
          errorMessage = "Email chưa được đăng ký";
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Icon name={isEditing ? "close" : "edit"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {userInfo?.avatarURL ? (
              <Image
                source={{ uri: userInfo.avatarURL }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="account-circle" size={100} color="#e57373" />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Icon name="camera-alt" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <View style={styles.infoSection}>
              <Icon name="person" size={24} color="#e57373" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Họ và tên</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedInfo.displayName}
                    onChangeText={(text) => setEditedInfo({...editedInfo, displayName: text})}
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <Text style={styles.value}>{userInfo?.displayName || 'Chưa cập nhật'}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoSection}>
              <Icon name="email" size={24} color="#e57373" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{userInfo?.email || 'Chưa cập nhật'}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Icon name="phone" size={24} color="#e57373" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Số điện thoại</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedInfo.phone}
                    onChangeText={(text) => setEditedInfo({...editedInfo, phone: text})}
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.value}>{userInfo?.phone || 'Chưa cập nhật'}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoSection}>
              <Icon name="location-on" size={24} color="#e57373" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Địa chỉ</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedInfo.address}
                    onChangeText={(text) => setEditedInfo({...editedInfo, address: text})}
                    placeholder="Nhập địa chỉ"
                    multiline
                  />
                ) : (
                  <Text style={styles.value}>{userInfo?.address || 'Chưa cập nhật'}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoSection}>
              <Icon name="event" size={24} color="#e57373" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Ngày tham gia</Text>
                <Text style={styles.value}>
                  {userInfo?.createdAt 
                    ? new Date(userInfo.createdAt).toLocaleDateString('vi-VN')
                    : 'Chưa cập nhật'}
                </Text>
              </View>
            </View>
          </View>

          {isEditing ? (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.changePasswordButton}
                onPress={() => setShowChangePassword(true)}
              >
                <Icon name="lock" size={24} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.changePasswordButtonText}>Đổi mật khẩu</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={handleLogout}
                disabled={loading}
              >
                <Icon name="logout" size={24} color="#fff" style={styles.logoutIcon} />
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {showChangePassword && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            
            <View style={styles.inputContainer}>
              <Icon name="lock" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Mật khẩu hiện tại"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Icon
                  name={showCurrentPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => setShowForgotPassword(true)}
            >
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Icon
                  name={showNewPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Xác nhận mật khẩu mới"
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

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowChangePassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);
              }}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showForgotPassword && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quên mật khẩu</Text>
            
            <View style={styles.inputContainer}>
              <Icon name="email" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email đã đăng ký"
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendButtonText}>Gửi link đặt lại mật khẩu</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowForgotPassword(false);
                setResetEmail("");
              }}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e57373',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileContainer: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#e57373',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 15,
    padding: 16,
    marginTop: 20,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoIcon: {
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  changePasswordButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#e57373',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    marginTop: -5,
  },
  forgotPasswordText: {
    color: '#e57373',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ProfileScreen; 