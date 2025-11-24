import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#ff6347',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="login"
                options={{
                    title: 'Login',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="cadastro"
                options={{
                    title: 'Cadastrar',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="index"
                options={{
                    title: 'Minhas Receitas',
                    headerShown: false 
                }}
            />
            <Stack.Screen
                name="perfil"
                options={{
                    title: 'Meu Perfil',
                    presentation: 'modal'
                }}
            />
            <Stack.Screen
                name="receita/[id]"
                options={{ title: 'Detalhes da Receita' }}
            />
            <Stack.Screen
                name="nova-receita"
                options={{ title: 'Nova Receita' }}
            />
            <Stack.Screen
                name="editar-receita/[id]"
                options={{ title: 'Editar Receita' }}
            />
        </Stack>

    );
}
