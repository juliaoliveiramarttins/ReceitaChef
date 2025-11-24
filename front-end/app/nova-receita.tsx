import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

interface Ingrediente {
    nome_ingrediente: string;
    quantidade: string;
    unidade_medida: string;
}

export default function NovaReceitaScreen() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [modoPreparo, setModoPreparo] = useState('');
    const [tempo, setTempo] = useState('');
    const [porcoes, setPorcoes] = useState('');
    const [categoria, setCategoria] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados para ingredientes
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [nomeIngrediente, setNomeIngrediente] = useState('');
    const [quantidadeIngrediente, setQuantidadeIngrediente] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');

    const categorias = [
        { nome: 'Sobremesa', icone: 'ice-cream' },
        { nome: 'Prato Principal', icone: 'restaurant' },
        { nome: 'Entrada', icone: 'nutrition' },
        { nome: 'Lanche', icone: 'fast-food' },
        { nome: 'Bebida', icone: 'cafe' },
        { nome: 'Outros', icone: 'apps' }
    ];

    const adicionarIngrediente = () => {
        if (!nomeIngrediente || !quantidadeIngrediente || !unidadeMedida) {
            Alert.alert('Atenção', 'Preencha todos os campos do ingrediente');
            return;
        }

        const novoIngrediente: Ingrediente = {
            nome_ingrediente: nomeIngrediente,
            quantidade: quantidadeIngrediente,
            unidade_medida: unidadeMedida
        };

        setIngredientes([...ingredientes, novoIngrediente]);

        // Limpar campos
        setNomeIngrediente('');
        setQuantidadeIngrediente('');
        setUnidadeMedida('');

        Alert.alert('Sucesso', 'Ingrediente adicionado!');
    };

    const removerIngrediente = (index: number) => {
        const novosIngredientes = ingredientes.filter((_, i) => i !== index);
        setIngredientes(novosIngredientes);
    };

    const salvarReceita = async () => {
        if (!nome || !modoPreparo || !tempo || !porcoes) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
            return;
        }

        if (isNaN(Number(tempo)) || isNaN(Number(porcoes))) {
            Alert.alert('Erro', 'Tempo e porções devem ser números');
            return;
        }

        if (ingredientes.length === 0) {
            Alert.alert(
                'Atenção',
                'Nenhum ingrediente foi adicionado. Deseja continuar mesmo assim?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Continuar', onPress: () => enviarReceita() }
                ]
            );
            return;
        }

        enviarReceita();
    };

    const enviarReceita = async () => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId');

            const novaReceita = {
                nome_receita: nome,
                descricao: descricao || 'Sem descrição',
                modo_preparo: modoPreparo,
                tempo_preparo: parseInt(tempo),
                porcoes: parseInt(porcoes),
                categoria: categoria || 'Outros',
                id_usuario: parseInt(userId || '1'),
                ingredientes: ingredientes
            };

            await api.post('/receitas', novaReceita);

            Alert.alert(
                'Sucesso!',
                'Receita cadastrada com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Erro ao criar receita:', error);
            Alert.alert('Erro', 'Não foi possível criar a receita');
        } finally {
            setLoading(false);
        }
    };

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

                    {/* SEÇÃO DE INGREDIENTES */}
                    {/* SEÇÃO DE INGREDIENTES */}
                    <Text style={styles.sectionTitle}>Ingredientes</Text>

                    <View style={styles.ingredientesForm}>
                        <Text style={styles.label}>Nome do Ingrediente</Text>
                        <TextInput
                            style={styles.input}
                            value={nomeIngrediente}
                            onChangeText={setNomeIngrediente}
                            placeholder="Ex: Ovos, Farinha de trigo, Leite"
                            placeholderTextColor="#999"
                        />

                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Text style={styles.label}>Quantidade</Text>
                                <TextInput
                                    style={styles.input}
                                    value={quantidadeIngrediente}
                                    onChangeText={setQuantidadeIngrediente}
                                    placeholder="Ex: 3, 2, 500"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={styles.halfInput}>
                                <Text style={styles.label}>Unidade</Text>
                                <TextInput
                                    style={styles.input}
                                    value={unidadeMedida}
                                    onChangeText={setUnidadeMedida}
                                    placeholder="Ex: un, xícaras, ml, g"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.btnAdicionarIngrediente}
                            onPress={adicionarIngrediente}
                        >
                            <Ionicons name="add-circle" size={20} color="#17a2b8" />
                            <Text style={styles.btnAdicionarIngredienteTexto}>
                                Adicionar Ingrediente
                            </Text>
                        </TouchableOpacity>

                        {/* Dicas rápidas */}
                        <View style={styles.dicasContainer}>
                            <Text style={styles.dicasTitle}>💡 Exemplos de unidades:</Text>
                            <View style={styles.dicasChips}>
                                <TouchableOpacity
                                    style={styles.dicaChip}
                                    onPress={() => setUnidadeMedida('unidades')}
                                >
                                    <Text style={styles.dicaChipText}>unidades</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dicaChip}
                                    onPress={() => setUnidadeMedida('xícaras')}
                                >
                                    <Text style={styles.dicaChipText}>xícaras</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dicaChip}
                                    onPress={() => setUnidadeMedida('ml')}
                                >
                                    <Text style={styles.dicaChipText}>ml</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dicaChip}
                                    onPress={() => setUnidadeMedida('g')}
                                >
                                    <Text style={styles.dicaChipText}>g</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dicaChip}
                                    onPress={() => setUnidadeMedida('kg')}
                                >
                                    <Text style={styles.dicaChipText}>kg</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dicaChip}
                                    onPress={() => setUnidadeMedida('colheres')}
                                >
                                    <Text style={styles.dicaChipText}>colheres</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    {/* LISTA DE INGREDIENTES ADICIONADOS */}
                    {ingredientes.length > 0 && (
                        <View style={styles.ingredientesLista}>
                            <Text style={styles.listaTitle}>
                                Ingredientes Adicionados ({ingredientes.length})
                            </Text>
                            {ingredientes.map((ing, index) => (
                                <View key={index} style={styles.ingredienteItem}>
                                    <View style={styles.ingredienteInfo}>
                                        <Ionicons name="checkmark-circle" size={20} color="#28a745" />
                                        <Text style={styles.ingredienteTexto}>
                                            {ing.quantidade} {ing.unidade_medida} de {ing.nome_ingrediente}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => removerIngrediente(index)}
                                        style={styles.btnRemover}
                                    >
                                        <Ionicons name="close-circle" size={24} color="#dc3545" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

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
                        style={[styles.btnSalvar, loading && styles.btnDisabled]}
                        onPress={salvarReceita}
                        disabled={loading}
                    >
                        <Ionicons name="checkmark-circle" size={24} color="white" />
                        <Text style={styles.btnTexto}>
                            {loading ? 'Salvando...' : 'Salvar Receita'}
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
    ingredientesForm: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 16,
    },
    btnAdicionarIngrediente: {
        backgroundColor: '#e7f8fa',
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#17a2b8',
    },
    btnAdicionarIngredienteTexto: {
        color: '#17a2b8',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ingredientesLista: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#28a745',
    },
    listaTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 12,
    },
    ingredienteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    ingredienteInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    ingredienteTexto: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
    btnRemover: {
        padding: 4,
    },
    btnSalvar: {
        backgroundColor: '#28a745',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#28a745',
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
    dicasContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    dicasTitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
    },
    dicasChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    dicaChip: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dicaChipText: {
        fontSize: 12,
        color: '#666',
    }

});
