import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import PotIcon from '../components/poticon';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';


export default function HomeScreen() {
    const [receitas, setReceitas] = useState([]);
    const [receitasFiltradas, setReceitasFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [minhasReceitas, setMinhasReceitas] = useState([]);
    const router = useRouter();

    const categorias = ['Todas', 'Sobremesa', 'Prato Principal', 'Entrada', 'Lanche', 'Bebida', 'Outros'];

    useEffect(() => {
        verificarLogin();
    }, []);


    useEffect(() => {
        filtrarReceitas();
    }, [pesquisa, receitas, categoriaFiltro]);


    const verificarLogin = async () => {
        const id = await AsyncStorage.getItem('userId');
        const nome = await AsyncStorage.getItem('userName');


        if (!id) {
            router.replace('/login');
        } else {
            setUserId(id);
            setUserName(nome || '');
            carregarReceitas(id);
        }
    };


    const carregarReceitas = async (id: string) => {
        try {
            const response = await api.get('/receitas');
            const todasReceitas = response.data;
            const receitasDoUsuario = todasReceitas.filter(
                (r: any) => r.id_usuario.toString() === id
            );


            setReceitas(todasReceitas);
            setReceitasFiltradas(todasReceitas);
            setMinhasReceitas(receitasDoUsuario);
        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
            Alert.alert('Erro', 'Não foi possível carregar as receitas');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    const filtrarReceitas = () => {
        let filtradas = receitas;

        // Filtro por categoria
        if (categoriaFiltro && categoriaFiltro !== 'Todas') {
            filtradas = filtradas.filter((receita: any) => 
                receita.categoria === categoriaFiltro
            );
        }

        // Filtro por pesquisa
        if (pesquisa.trim()) {
            const termo = pesquisa.toLowerCase();
            filtradas = filtradas.filter((receita: any) =>
                receita.nome_receita.toLowerCase().includes(termo) ||
                receita.categoria.toLowerCase().includes(termo) ||
                (receita.nome_autor && receita.nome_autor.toLowerCase().includes(termo)) ||
                (receita.descricao && receita.descricao.toLowerCase().includes(termo))
            );
        }

        setReceitasFiltradas(filtradas);
    };


    const onRefresh = () => {
        setRefreshing(true);
        setPesquisa('');
        setCategoriaFiltro('');
        carregarReceitas(userId);
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


    const renderReceita = ({ item }: any) => {
        const ehMinhaReceita = item.id_usuario.toString() === userId;


        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/receita/${item.id_receita}`)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.categoriaTag}>
                        <Ionicons name={getCategoriaIcon(item.categoria)} size={14} color="#ff6347" />
                        <Text style={styles.categoriaTexto}>{item.categoria}</Text>
                    </View>
                    {ehMinhaReceita && (
                        <View style={styles.minhaReceitaBadge}>
                            <Ionicons name="star" size={12} color="#ffc107" />
                            <Text style={styles.minhaReceitaTexto}>Minha</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.titulo}>{item.nome_receita}</Text>
                {item.descricao && (
                    <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
                )}
                <View style={styles.cardFooter}>
                    <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={18} color="#666" />
                        <Text style={styles.infoTexto}>{item.tempo_preparo} min</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="people-outline" size={18} color="#666" />
                        <Text style={styles.infoTexto}>{item.porcoes} porções</Text>
                    </View>
                </View>
                {!ehMinhaReceita && item.nome_autor && (
                    <View style={styles.autorContainer}>
                        <Ionicons name="person-circle-outline" size={16} color="#999" />
                        <Text style={styles.autorTexto}>por {item.nome_autor}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };


    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#ff6347" />
                <Text style={styles.loadingText}>Carregando receitas...</Text>
            </View>
        );
    }


    const categoriasUnicas = new Set(minhasReceitas.map((r: any) => r.categoria)).size;


    return (
        <View style={styles.container}>
            {/* HEADER COM LOGO E NAVEGAÇÃO */}
            <View>
                <View style={styles.topBar}>
                    <View style={styles.logoContainer}>
                        <PotIcon size={40} />
                        <View style={styles.appNameContainer}>
                            <Text style={styles.appNameCook}>Receita</Text>
                            <Text style={styles.appNameNote}>Chef</Text>
                        </View>
                    </View>


                    <View style={styles.topBarActions}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="notifications-outline" size={26} color="#333" />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>3</Text>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push('/perfil')}
                        >
                            <Ionicons name="person-circle-outline" size={32} color="#ff6347" />
                        </TouchableOpacity>
                    </View>
                </View>


                {/* LINHA DEGRADÊ */}
                <LinearGradient
                    colors={['#fefefeff','#ffa77fd0','#ff7e43d0','#FF6347']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientLine}
                />
            </View>



            {/* SAUDAÇÃO E ESTATÍSTICAS */}
            <View style={styles.welcomeSection}>
                <View style={styles.welcomeTextContainer}>
                    <Text style={styles.saudacao}>Olá, {userName}!</Text>
                    <Text style={styles.subtitulo}>O que vamos cozinhar hoje?</Text>
                </View>


                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons name="book" size={24} color="#ff6347" />
                        <View style={styles.statInfo}>
                            <Text style={styles.statNumber}>{minhasReceitas.length}</Text>
                            <Text style={styles.statLabel}>Receitas</Text>
                        </View>
                    </View>


                    <View style={styles.statCard}>
                        <Ionicons name="apps" size={24} color="#28a745" />
                        <View style={styles.statInfo}>
                            <Text style={styles.statNumber}>{categoriasUnicas}</Text>
                            <Text style={styles.statLabel}>Categorias</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* BARRA DE PESQUISA E FILTROS - FORA DA FLATLIST */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar receitas..."
                        value={pesquisa}
                        onChangeText={setPesquisa}
                        placeholderTextColor="#999"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {pesquisa.length > 0 && (
                        <TouchableOpacity onPress={() => setPesquisa('')} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* FILTRO POR CATEGORIAS */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriasScroll}
                    contentContainerStyle={styles.categoriasContent}
                >
                    {categorias.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoriaFiltroChip,
                                (categoriaFiltro === cat || (cat === 'Todas' && !categoriaFiltro)) && styles.categoriaFiltroChipActive
                            ]}
                            onPress={() => setCategoriaFiltro(cat === 'Todas' ? '' : cat)}
                        >
                            {cat !== 'Todas' && (
                                <Ionicons 
                                    name={getCategoriaIcon(cat)} 
                                    size={16} 
                                    color={(categoriaFiltro === cat || (cat === 'Todas' && !categoriaFiltro)) ? 'white' : '#666'} 
                                />
                            )}
                            <Text style={[
                                styles.categoriaFiltroTexto,
                                (categoriaFiltro === cat || (cat === 'Todas' && !categoriaFiltro)) && styles.categoriaFiltroTextoActive
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {(pesquisa.length > 0 || categoriaFiltro) && (
                    <Text style={styles.resultadosTexto}>
                        {receitasFiltradas.length} {receitasFiltradas.length === 1 ? 'resultado' : 'resultados'}
                    </Text>
                )}
            </View>


            {receitasFiltradas.length === 0 && !pesquisa && !categoriaFiltro ? (
                <View style={styles.center}>
                    <Ionicons name="document-text-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Nenhuma receita cadastrada</Text>
                    <Text style={styles.emptySubtext}>Comece criando sua primeira receita!</Text>
                </View>
            ) : (
                <FlatList
                    data={receitasFiltradas}
                    keyExtractor={(item: any) => item.id_receita.toString()}
                    renderItem={renderReceita}
                    ListEmptyComponent={
                        <View style={styles.emptySearch}>
                            <Ionicons name="search-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>Nenhuma receita encontrada</Text>
                            <Text style={styles.emptySubtext}>Tente pesquisar por outro termo ou categoria</Text>
                        </View>
                    }
                    contentContainerStyle={styles.lista}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ff6347']} />
                    }
                />
            )}


            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/nova-receita')}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    topBar: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    appNameContainer: {
        flexDirection: 'row',
    },
    appNameCook: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    appNameNote: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6347',
    },
    topBarActions: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    iconButton: {
        position: 'relative',
        padding: 4,
    },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#ff6347',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    notificationBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    welcomeSection: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    welcomeTextContainer: {
        marginBottom: 16,
    },
    saudacao: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitulo: {
        fontSize: 15,
        color: '#666',
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#d1d1d12e',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statInfo: {
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    searchSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#f8f9fa',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        padding: 4,
    },
    categoriasScroll: {
        marginBottom: 8,
    },
    categoriasContent: {
        gap: 8,
        paddingRight: 16,
    },
    categoriaFiltroChip: {
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
    categoriaFiltroChipActive: {
        backgroundColor: '#ff6347',
        borderColor: '#ff6347',
    },
    categoriaFiltroTexto: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    categoriaFiltroTextoActive: {
        color: 'white',
    },
    resultadosTexto: {
        fontSize: 13,
        color: '#666',
        marginTop: 8,
        marginLeft: 4,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptySearch: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#666',
        fontSize: 16,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    lista: {
        paddingBottom: 16,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    cardHeader: {
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoriaTag: {
        backgroundColor: '#fff5f3',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    categoriaTexto: {
        color: '#ff6347',
        fontSize: 12,
        fontWeight: '600',
    },
    minhaReceitaBadge: {
        backgroundColor: '#fff9e6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    minhaReceitaTexto: {
        color: '#ffc107',
        fontSize: 11,
        fontWeight: 'bold',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    descricao: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoTexto: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    autorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    autorTexto: {
        fontSize: 13,
        color: '#999',
        fontStyle: 'italic',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ff6347',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ff6347',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    gradientLine: {
        height: 3,
        width: '100%',
    },
});
