import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function PerfilScreen() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<any>(null);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [editando, setEditando] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            
            // Buscar dados do usuário
            const responseUser = await api.get(`/usuarios/${userId}`);
            setUsuario(responseUser.data);
            setNome(responseUser.data.nome);
            setEmail(responseUser.data.email);

            // Buscar total de receitas do usuário
            const responseReceitas = await api.get('/receitas');
            const minhasReceitas = responseReceitas.data.filter(
                (r: any) => r.id_usuario.toString() === userId
            );
            setTotalReceitas(minhasReceitas.length);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            Alert.alert('Erro', 'Não foi possível carregar o perfil');
        } finally {
            setLoading(false);
        }
    };

    const salvarAlteracoes = async () => {
        if (!nome || !email) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('userId');
            await api.put(`/usuarios/${userId}`, {
                nome,
                email,
                senha: usuario.senha // Manter senha atual
            });

            await AsyncStorage.setItem('userName', nome);
            setEditando(false);
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            carregarPerfil();
        } catch (error: any) {
            console.error('Erro ao atualizar perfil:', error);
            if (error.response?.data?.erro) {
                Alert.alert('Erro', error.response.data.erro);
            } else {
                Alert.alert('Erro', 'Não foi possível atualizar o perfil');
            }
        }
    };

    const fazerLogout = () => {
        Alert.alert(
            'Sair',
            'Deseja realmente sair da sua conta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    if (loading || !usuario) {
        return (
            <View style={styles.center}>
                <Ionicons name="person-circle-outline" size={64} color="#ccc" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={64} color="white" />
                    </View>
                    <View style={styles.badge}>
                        <Ionicons name="star" size={16} color="#ffc107" />
                    </View>
                </View>
                {!editando && (
                    <Text style={styles.nomeHeader}>{usuario.nome}</Text>
                )}
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="book" size={32} color="#ff6347" />
                    <Text style={styles.statNumero}>{totalReceitas}</Text>
                    <Text style={styles.statLabel}>Receitas</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="calendar" size={32} color="#28a745" />
                    <Text style={styles.statNumero}>
                        {new Date(usuario.data_cadastro).toLocaleDateString('pt-BR')}
                    </Text>
                    <Text style={styles.statLabel}>Membro desde</Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="information-circle" size={24} color="#333" />
                    <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                    {!editando && (
                        <TouchableOpacity 
                            style={styles.btnEditar}
                            onPress={() => setEditando(true)}
                        >
                            <Ionicons name="pencil" size={20} color="#ff6347" />
                        </TouchableOpacity>
                    )}
                </View>

                {editando ? (
                    <>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Seu nome"
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Seu email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <View style={styles.botoesContainer}>
                            <TouchableOpacity 
                                style={styles.btnSalvar}
                                onPress={salvarAlteracoes}
                            >
                                <Ionicons name="checkmark-circle" size={20} color="white" />
                                <Text style={styles.btnSalvarTexto}>Salvar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.btnCancelar}
                                onPress={() => {
                                    setEditando(false);
                                    setNome(usuario.nome);
                                    setEmail(usuario.email);
                                }}
                            >
                                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.infoItem}>
                            <Ionicons name="person-outline" size={20} color="#666" />
                            <View style={styles.infoTextos}>
                                <Text style={styles.infoLabel}>Nome</Text>
                                <Text style={styles.infoValor}>{usuario.nome}</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <Ionicons name="mail-outline" size={20} color="#666" />
                            <View style={styles.infoTextos}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValor}>{usuario.email}</Text>
                            </View>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="settings" size={24} color="#333" />
                    <Text style={styles.sectionTitle}>Configurações</Text>
                </View>

                <TouchableOpacity style={styles.opcaoItem}>
                    <View style={styles.opcaoIcone}>
                        <Ionicons name="notifications-outline" size={24} color="#666" />
                    </View>
                    <Text style={styles.opcaoTexto}>Notificações</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.opcaoItem}>
                    <View style={styles.opcaoIcone}>
                        <Ionicons name="lock-closed-outline" size={24} color="#666" />
                    </View>
                    <Text style={styles.opcaoTexto}>Alterar Senha</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.opcaoItem}>
                    <View style={styles.opcaoIcone}>
                        <Ionicons name="help-circle-outline" size={24} color="#666" />
                    </View>
                    <Text style={styles.opcaoTexto}>Ajuda e Suporte</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnLogout} onPress={fazerLogout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.btnLogoutTexto}>Sair da Conta</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpace} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#666',
        fontSize: 16,
    },
    header: {
        backgroundColor: '#ff6347',
        padding: 32,
        alignItems: 'center',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ff8570',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    badge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ff6347',
    },
    nomeHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumero: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    section: {
        backgroundColor: 'white',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    btnEditar: {
        padding: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoTextos: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    infoValor: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#f8f9fa',
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    botoesContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    btnSalvar: {
        flex: 1,
        backgroundColor: '#28a745',
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    btnSalvarTexto: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnCancelar: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnCancelarTexto: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    opcaoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    opcaoIcone: {
        marginRight: 16,
    },
    opcaoTexto: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    btnLogout: {
        backgroundColor: '#dc3545',
        marginHorizontal: 16,
        padding: 18,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#dc3545',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    btnLogoutTexto: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomSpace: {
        height: 32,
    },
});
