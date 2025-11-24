import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import PotIcon from '../components/poticon';

export default function CadastroScreen() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const fazerCadastro = async () => {
        if (!nome || !email || !senha || !confirmarSenha) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return;
        }

        if (senha.length < 6) {
            Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            await api.post('/usuarios', {
                nome,
                email,
                senha
            });

            Alert.alert(
                'Sucesso!', 
                'Cadastro realizado com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error: any) {
            console.error('Erro ao cadastrar:', error);
            if (error.response?.data?.erro) {
                Alert.alert('Erro', error.response.data.erro);
            } else {
                Alert.alert('Erro', 'Não foi possível realizar o cadastro');
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
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.logoContainer}>
                    <PotIcon size={90} />
                </View>
                
                <View style={styles.tituloContainer}>
                    <Text style={styles.tituloCook}>Receita</Text>
                    <Text style={styles.tituloNote}>Chef</Text>
                </View>
                
                <Text style={styles.subtitulo}>Crie sua conta</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome completo"
                    value={nome}
                    onChangeText={setNome}
                    placeholderTextColor="#999"
                />

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
                    placeholder="Senha (mínimo 6 caracteres)"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    placeholderTextColor="#999"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirmar senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry
                    placeholderTextColor="#999"
                />

                <TouchableOpacity 
                    style={[styles.btnPrimary, loading && styles.btnDisabled]}
                    onPress={fazerCadastro}
                    disabled={loading}
                >
                    <Text style={styles.btnTexto}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.btnSecondary}
                    onPress={() => router.back()}
                >
                    <Text style={styles.btnSecondaryTexto}>
                        Já tem conta? Faça login
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 32,
        paddingTop: 60,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    tituloContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    tituloCook: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    tituloNote: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6347',
    },
    subtitulo: {
        fontSize: 20,
        textAlign: 'center',
        color: '#666',
        marginBottom: 32,
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
