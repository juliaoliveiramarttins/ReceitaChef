import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function EditarReceitaScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [modoPreparo, setModoPreparo] = useState('');
    const [tempo, setTempo] = useState('');
    const [porcoes, setPorcoes] = useState('');
    const [categoria, setCategoria] = useState('');

    const categorias = [
        { nome: 'Sobremesa', icone: 'ice-cream' },
        { nome: 'Prato Principal', icone: 'restaurant' },
        { nome: 'Entrada', icone: 'nutrition' },
        { nome: 'Lanche', icone: 'fast-food' },
        { nome: 'Bebida', icone: 'cafe' },
        { nome: 'Outros', icone: 'apps' }
    ];

    useEffect(() => {
        carregarReceita();
    }, []);

    const carregarReceita = async () => {
        try {
            const response = await api.get(`/receitas/${id}`);
            const receita = response.data;
            
            setNome(receita.nome_receita);
            setDescricao(receita.descricao || '');
            setModoPreparo(receita.modo_preparo);
            setTempo(receita.tempo_preparo.toString());
            setPorcoes(receita.porcoes.toString());
            setCategoria(receita.categoria);
        } catch (error) {
            console.error('Erro ao carregar receita:', error);
            Alert.alert('Erro', 'Não foi possível carregar a receita');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const salvarAlteracoes = async () => {
        if (!nome || !modoPreparo || !tempo || !porcoes) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
            return;
        }

        if (isNaN(Number(tempo)) || isNaN(Number(porcoes))) {
            Alert.alert('Erro', 'Tempo e porções devem ser números');
            return;
        }

        setSalvando(true);
        try {
            await api.put(`/receitas/${id}`, {
                nome_receita: nome,
                descricao: descricao || 'Sem descrição',
                modo_preparo: modoPreparo,
                tempo_preparo: parseInt(tempo),
                porcoes: parseInt(porcoes),
                categoria: categoria || 'Outros'
            });
            
            Alert.alert(
                'Sucesso!', 
                'Receita atualizada com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Erro ao atualizar receita:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a receita');
        } finally {
            setSalvando(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#ff6347" />
                <Text style={styles.loadingText}>Carregando receita...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.form}>
                    <Text style={styles.sectionTitle}>Informações Básicas</Text>

                    <Text style={styles.label}>Nome da Receita *</Text>
                    <TextInput
                        style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Ex: Bolo de Chocolate"
                        placeholderTextColor="#999"
                    />

                    <Text style={styles.label}>Categoria</Text>
                    <View style={styles.categoriasContainer}>
                        {categorias.map((cat) => (
                            <TouchableOpacity
                                key={cat.nome}
                                style={[
                                    styles.categoriaChip,
                                    categoria === cat.nome && styles.categoriaChipActive
                                ]}
                                onPress={() => setCategoria(cat.nome)}
                            >
                                <Ionicons 
                                    name={cat.icone as any} 
                                    size={16} 
                                    color={categoria === cat.nome ? 'white' : '#666'} 
                                />
                                <Text style={[
                                    styles.categoriaChipText,
                                    categoria === cat.nome && styles.categoriaChipTextActive
                                ]}>
                                    {cat.nome}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={descricao}
                        onChangeText={setDescricao}
                        placeholder="Breve descrição da receita"
                        multiline
                        numberOfLines={3}
                        placeholderTextColor="#999"
                        textAlignVertical="top"
                    />

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Tempo (min) *</Text>
                            <TextInput
                                style={styles.input}
                                value={tempo}
                                onChangeText={setTempo}
                                placeholder="30"
                                keyboardType="numeric"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Porções *</Text>
                            <TextInput
                                style={styles.input}
                                value={porcoes}
                                onChangeText={setPorcoes}
                                placeholder="4"
                                keyboardType="numeric"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Modo de Preparo *</Text>
                    <TextInput
                        style={[styles.input, styles.textAreaLarge]}
                        value={modoPreparo}
                        onChangeText={setModoPreparo}
                        placeholder="Descreva o passo a passo do preparo..."
                        multiline
                        numberOfLines={8}
                        placeholderTextColor="#999"
                        textAlignVertical="top"
                    />

                    <TouchableOpacity 
                        style={[styles.btnSalvar, salvando && styles.btnDisabled]}
                        onPress={salvarAlteracoes}
                        disabled={salvando}
                    >
                        <Ionicons name="checkmark-circle" size={24} color="white" />
                        <Text style={styles.btnTexto}>
                            {salvando ? 'Salvando...' : 'Salvar Alterações'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.btnCancelar}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    scrollContent: {
        flexGrow: 1,
    },
    form: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    textAreaLarge: {
        height: 150,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    categoriasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    categoriaChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    categoriaChipActive: {
        backgroundColor: '#ff6347',
        borderColor: '#ff6347',
    },
    categoriaChipText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    categoriaChipTextActive: {
        color: 'white',
    },
    btnSalvar: {
        backgroundColor: '#ff6347',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
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
    btnCancelar: {
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 32,
    },
    btnCancelarTexto: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});
