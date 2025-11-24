import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function DetalhesScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [receita, setReceita] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        const id_user = await AsyncStorage.getItem('userId');
        setUserId(id_user || '');
        carregarReceita();
    };

    const carregarReceita = async () => {
        try {
            const response = await api.get(`/receitas/${id}`);
            setReceita(response.data);
        } catch (error) {
            console.error('Erro ao carregar receita:', error);
            Alert.alert('Erro', 'Não foi possível carregar a receita');
        } finally {
            setLoading(false);
        }
    };

    const deletarReceita = () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Deseja realmente deletar esta receita?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Deletar', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/receitas/${id}`);
                            Alert.alert('Sucesso', 'Receita deletada!', [
                                { text: 'OK', onPress: () => router.back() }
                            ]);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível deletar a receita');
                        }
                    }
                }
            ]
        );
    };

    const getCategoriaIcon = (categoria: string) => {
        const icons: any = {
            'Sobremesa': 'ice-cream',
            'Prato Principal': 'restaurant',
            'Entrada': 'nutrition',
            'Lanche': 'fast-food',
            'Bebida': 'cafe',
            'Outros': 'apps'
        };
        return icons[categoria] || 'apps';
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#ff6347" />
                <Text style={styles.loadingText}>Carregando receita...</Text>
            </View>
        );
    }

    if (!receita) {
        return (
            <View style={styles.center}>
                <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
                <Text style={styles.errorText}>Receita não encontrada</Text>
            </View>
        );
    }

    const ehMinhaReceita = receita.id_usuario.toString() === userId;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.categoriaTag}>
                    <Ionicons name={getCategoriaIcon(receita.categoria)} size={16} color="#ff6347" />
                    <Text style={styles.categoriaTexto}>{receita.categoria}</Text>
                </View>
                <Text style={styles.titulo}>{receita.nome_receita}</Text>
                
                {ehMinhaReceita && (
                    <View style={styles.autorBadge}>
                        <Ionicons name="star" size={16} color="#ffc107" />
                        <Text style={styles.autorBadgeTexto}>Sua Receita</Text>
                    </View>
                )}
            </View>

            <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                    <View style={styles.infoIconWrapper}>
                        <Ionicons name="time-outline" size={24} color="#ff6347" />
                    </View>
                    <View>
                        <Text style={styles.infoLabel}>Tempo</Text>
                        <Text style={styles.infoValor}>{receita.tempo_preparo} min</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoItem}>
                    <View style={styles.infoIconWrapper}>
                        <Ionicons name="people-outline" size={24} color="#ff6347" />
                    </View>
                    <View>
                        <Text style={styles.infoLabel}>Porções</Text>
                        <Text style={styles.infoValor}>{receita.porcoes}</Text>
                    </View>
                </View>
            </View>

            {receita.descricao && (
                <View style={styles.secao}>
                    <View style={styles.secaoHeader}>
                        <Ionicons name="document-text-outline" size={24} color="#333" />
                        <Text style={styles.secaoTitulo}>Descrição</Text>
                    </View>
                    <Text style={styles.texto}>{receita.descricao}</Text>
                </View>
            )}

            {receita.ingredientes && receita.ingredientes.length > 0 && (
                <View style={styles.secao}>
                    <View style={styles.secaoHeader}>
                        <Ionicons name="list-outline" size={24} color="#333" />
                        <Text style={styles.secaoTitulo}>Ingredientes</Text>
                    </View>
                    {receita.ingredientes.map((ing: any, index: number) => (
                        <View key={index} style={styles.ingredienteItem}>
                            <View style={styles.checkCircle}>
                                <Ionicons name="checkmark" size={16} color="#28a745" />
                            </View>
                            <Text style={styles.ingrediente}>
                                {ing.quantidade} {ing.unidade_medida} de {ing.nome_ingrediente}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.secao}>
                <View style={styles.secaoHeader}>
                    <Ionicons name="book-outline" size={24} color="#333" />
                    <Text style={styles.secaoTitulo}>Modo de Preparo</Text>
                </View>
                <Text style={styles.texto}>{receita.modo_preparo}</Text>
            </View>

            {!ehMinhaReceita && receita.nome_autor && (
                <View style={styles.autorSecao}>
                    <Ionicons name="person-circle" size={40} color="#999" />
                    <View>
                        <Text style={styles.autorLabel}>Autor da receita</Text>
                        <Text style={styles.autorNome}>{receita.nome_autor}</Text>
                    </View>
                </View>
            )}

            {ehMinhaReceita && (
                <View style={styles.botoesContainer}>
                    <TouchableOpacity 
                        style={styles.btnEditar} 
                        onPress={() => router.push(`/editar-receita/${id}` as any)}

                    >
                        <Ionicons name="create-outline" size={24} color="white" />
                        <Text style={styles.btnEditarTexto}>Editar Receita</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnDeletar} onPress={deletarReceita}>
                        <Ionicons name="trash-outline" size={24} color="white" />
                        <Text style={styles.btnDeletarTexto}>Deletar Receita</Text>
                    </TouchableOpacity>
                </View>
            )}

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
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        color: '#666',
        fontSize: 16,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
    },
    header: {
        backgroundColor: 'white',
        padding: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoriaTag: {
        backgroundColor: '#fff5f3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoriaTexto: {
        color: '#ff6347',
        fontSize: 14,
        fontWeight: '700',
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        lineHeight: 34,
        marginBottom: 12,
    },
    autorBadge: {
        backgroundColor: '#fff9e6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
    },
    autorBadgeTexto: {
        color: '#ffc107',
        fontSize: 13,
        fontWeight: 'bold',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff5f3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    infoValor: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#e0e0e0',
    },
    secao: {
        backgroundColor: 'white',
        padding: 24,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    secaoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    secaoTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    texto: {
        fontSize: 16,
        color: '#666',
        lineHeight: 26,
    },
    ingredienteItem: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    ingrediente: {
        fontSize: 16,
        color: '#666',
        flex: 1,
        lineHeight: 24,
    },
    autorSecao: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderWidth: 2,
        borderColor: '#f0f0f0',
    },
    autorLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    autorNome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    botoesContainer: {
        marginHorizontal: 16,
        gap: 12,
    },
    btnEditar: {
        backgroundColor: '#ff6347',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#ff6347',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    btnEditarTexto: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    btnDeletar: {
        backgroundColor: '#dc3545',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#dc3545',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    btnDeletarTexto: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomSpace: {
        height: 32,
    },
});
