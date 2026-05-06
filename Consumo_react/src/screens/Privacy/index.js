// Privacy/index.js
// Política de privacidade do Wavunder.
// Informa ao usuário quais dados são coletados, como são usados e protegidos.
// Segue diretrizes da LGPD (Lei 13.709/2018).
import React, { useContext } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  SafeAreaView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../contexts/ThemeContext';

// ─── SEÇÕES DA POLÍTICA ───────────────────────────────────────────────────────
const SECOES = [
  {
    icone: 'shield-checkmark-outline',
    titulo: '1. Compromisso com sua Privacidade',
    texto: 'O Wavunder foi desenvolvido com respeito à privacidade dos seus dados. Esta política descreve de forma transparente quais informações coletamos, como as utilizamos e como as protegemos, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).',
  },
  {
    icone: 'server-outline',
    titulo: '2. Dados Coletados',
    texto: 'Coletamos apenas as informações necessárias para o funcionamento do app:\n\n• Nome e endereço de e-mail — para identificar sua conta\n• Senha — armazenada com hash bcrypt (nunca em texto puro)\n• Registros de consumo — água (litros), energia (kWh) e outros gastos (R$) com data e tipo\n• Foto de perfil — armazenada localmente no seu dispositivo, não enviada ao servidor\n\nNão coletamos localização, contatos, histórico de navegação ou qualquer dado sensível além dos listados.',
  },
  {
    icone: 'eye-outline',
    titulo: '3. Como Usamos seus Dados',
    texto: 'Seus dados são utilizados exclusivamente para:\n\n• Autenticar seu acesso ao app\n• Exibir seu histórico pessoal de consumo\n• Calcular seu nível de sustentabilidade semanal\n• Gerar gráficos e relatórios personalizados\n• Enviar o código de recuperação de senha quando solicitado\n\nSeus dados de consumo são estritamente pessoais — nenhum outro usuário tem acesso a eles.',
  },
  {
    icone: 'lock-closed-outline',
    titulo: '4. Segurança dos Dados',
    texto: 'Adotamos as seguintes medidas de segurança:\n\n• Senhas protegidas com bcrypt (algoritmo de hash com salt)\n• Isolamento de dados por id_usuario no banco de dados\n• Mensagem de login genérica (não revelamos se o erro é no e-mail ou na senha)\n• Timeout de 10 segundos em todas as requisições\n• Banco de dados PostgreSQL gerenciado pelo Railway em infraestrutura segura',
  },
  {
    icone: 'share-social-outline',
    titulo: '5. Compartilhamento de Dados',
    texto: 'Não vendemos, alugamos nem compartilhamos seus dados pessoais com terceiros.\n\nO único serviço externo utilizado é o servidor de e-mail (Gmail SMTP) para envio do código de recuperação de senha, operado pelo Google LLC, sob as políticas de privacidade do Google.',
  },
  {
    icone: 'time-outline',
    titulo: '6. Retenção de Dados',
    texto: 'Seus dados são mantidos enquanto sua conta estiver ativa. Você pode solicitar a exclusão da sua conta e todos os dados associados a qualquer momento, resultando na remoção permanente de todas as suas informações do banco de dados.',
  },
  {
    icone: 'person-outline',
    titulo: '7. Seus Direitos (LGPD)',
    texto: 'De acordo com a LGPD, você tem direito a:\n\n• Confirmar a existência de tratamento dos seus dados\n• Acessar seus dados pessoais\n• Corrigir dados incompletos ou incorretos\n• Solicitar a exclusão dos seus dados\n• Portabilidade dos dados\n• Revogar seu consentimento\n\nComo projeto acadêmico, o exercício desses direitos ocorre diretamente pelo app (editar perfil, excluir registros) ou via contato com a equipe do projeto.',
  },
  {
    icone: 'code-slash-outline',
    titulo: '8. Projeto Acadêmico',
    texto: 'O Wavunder é um projeto desenvolvido para fins acadêmicos na disciplina de Desenvolvimento de Sistemas. O código-fonte é aberto e está disponível no repositório GitHub do projeto. Não há fins comerciais.',
  },
  {
    icone: 'refresh-outline',
    titulo: '9. Atualizações desta Política',
    texto: 'Esta política pode ser atualizada ao longo do desenvolvimento do projeto. A versão mais recente estará sempre disponível nesta tela. Última atualização: maio de 2026.',
  },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function PrivacidadeScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Cabeçalho */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: Platform.OS === 'android' ? 40 : 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
          Política de Privacidade
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Banner LGPD */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 14,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: colors.teal || '#1D9E75',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
          <Ionicons name="shield-outline" size={24} color={colors.teal || '#1D9E75'} />
          <Text style={{ color: colors.textSub || colors.text, fontSize: 12, flex: 1, lineHeight: 18 }}>
            Este app está em conformidade com a{' '}
            <Text style={{ fontWeight: '700', color: colors.text }}>LGPD (Lei 13.709/2018)</Text>.
            Seus dados são usados apenas para o funcionamento do Wavunder.
          </Text>
        </View>

        {/* Seções */}
        {SECOES.map((secao, idx) => (
          <View key={idx} style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Ionicons name={secao.icone} size={18} color={colors.teal || '#1D9E75'} />
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', flex: 1 }}>
                {secao.titulo}
              </Text>
            </View>
            <Text style={{ color: colors.textSub || colors.text, fontSize: 13, lineHeight: 20 }}>
              {secao.texto}
            </Text>
          </View>
        ))}

        {/* Versão */}
        <Text style={{
          color: colors.textSub || colors.text,
          fontSize: 11,
          textAlign: 'center',
          marginTop: 8,
          opacity: 0.6,
        }}>
          Wavunder v3 · Política de Privacidade · Maio 2026
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
