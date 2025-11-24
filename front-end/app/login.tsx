import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PotIcon from '../components/poticon';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const fazerLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/usuarios/login', {
                email,
                senha
            });

            if (response.data.usuario) {
                const usuario = response.data.usuario;
                await AsyncStorage.setItem('userId', usuario.id_usuario.toString());
                await AsyncStorage.setItem('userName', usuario.nome);
                Alert.alert('Sucesso', `Bem-vindo, ${usuario.nome}!`);
                router.replace('/');
            }
        } catch (error: any) {
            console.error('Erro ao fazer login:', error);
            if (error.response?.status === 401) {
                Alert.alert('Erro', 'Email ou senha incorretos');
            } else if (error.response?.data?.erro) {
                Alert.alert('Erro', error.response.data.erro);
            } else {
                Alert.alert('Erro', 'Não foi possível fazer login. Verifique sua conexão.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <PotIcon size={100} />
                </View>
                
                <View style={styles.tituloContainer}>
                    <Text style={styles.tituloCook}>Receita</Text>
                    <Text style={styles.tituloNote}>Chef</Text>
                </View>
                
                <Text style={styles.subtitulo}>Faça login para continuar</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    placeholderTextColor="#999"
                />

                <TouchableOpacity
                    style={[styles.btnPrimary, loading && styles.btnDisabled]}
                    onPress={fazerLogin}
                    disabled={loading}
                >
                    <Text style={styles.btnTexto}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => router.push('/cadastro')}
                >
                    <Text style={styles.btnSecondaryTexto}>
                        Não tem conta? Cadastre-se
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 32,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    tituloContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    tituloCook: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
    },
    tituloNote: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF6347',
    },
    subtitulo: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 48,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    btnPrimary: {
        backgroundColor: '#ff6347',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#ff6347',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    btnDisabled: {
        backgroundColor: '#ccc',
    },
    btnTexto: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    btnSecondary: {
        marginTop: 24,
        padding: 12,
    },
    btnSecondaryTexto: {
        color: '#ff6347',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
});
