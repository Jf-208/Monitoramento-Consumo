// Help/index.js
// Central de Ajuda do Wavunder — FAQ em cards estáticos com estilo premium.
// Mesmo padrão visual da tela de Privacidade (SafeAreaView + ScrollView nativo).
import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../contexts/ThemeContext";

// ─── PERGUNTAS FREQUENTES ────────────────────────────────────────────────────
const FAQ = [
  {
    icone: "phone-portrait-outline",
    pergunta: "Como funciona o Wavunder?",
    resposta:
      "O Wavunder é um aplicativo de monitoramento sustentável que registra seu consumo de água e energia. Você informa o tempo de uso de cada atividade (como banho, chuveiro ou ar-condicionado) e o app calcula automaticamente a quantidade consumida e o custo estimado. Com isso, você acompanha seu padrão de consumo em gráficos semanais e recebe um nível de sustentabilidade personalizado: Ótimo, Bom, Atenção ou Crítico.",
  },
  {
    icone: "calculator-outline",
    pergunta: "Como o aplicativo calcula meu consumo?",
    resposta:
      "Para a água, usamos o fator de vazão de cada tipo de uso:\n• Banho: 7 litros por minuto\n• Pia: 6 litros por minuto\n• Louça: 10 litros por minuto\n\nPara a energia, usamos a fórmula:\nConsumo (kWh) = Potência (W) × Tempo (min) ÷ 60 ÷ 1000\n\nO custo é calculado com base nas tarifas médias brasileiras: R$ 6,50/m³ para água (SNIS 2022) e R$ 0,87/kWh para energia (ANEEL). Tudo de forma automática ao inserir o tempo de uso.",
  },
  {
    icone: "bar-chart-outline",
    pergunta: "O que significa meu nível sustentável?",
    resposta:
      "O nível é calculado com base no seu ritmo de consumo semanal comparado com médias de referência brasileiras:\n\n• Ótimo — abaixo de 80% da média: parabéns, você está economizando!\n• Bom — entre 80% e 100%: consumo dentro do esperado.\n• Atenção — entre 100% e 130%: consumo acima da média, vale revisar os hábitos.\n• Crítico — acima de 130%: consumo muito elevado, reduza onde possível.\n\nEle é atualizado automaticamente a cada novo registro.",
  },
  {
    icone: "shield-checkmark-outline",
    pergunta: "Meus dados estão seguros?",
    resposta:
      "Sim. O Wavunder adota boas práticas de segurança:\n\n• Senhas protegidas com hash bcrypt — nunca armazenadas em texto puro\n• Seus registros de consumo são isolados por usuário: ninguém acessa seus dados\n• Erro de login retorna mensagem genérica para proteger sua privacidade\n• Comunicação com o servidor ocorre por HTTPS\n\nO app está em conformidade com a LGPD (Lei 13.709/2018). Consulte a Política de Privacidade para mais detalhes.",
  },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function AjudaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const teal = colors.teal || "#1D9E75";

  // FIX SCROLL: na web o Stack Navigator não propaga altura ao filho,
  // então height:'100%' colapsa para zero. Usamos flex:1 + overflow:auto
  // que funciona independente do pai ter altura explícita ou não.
  const screenHeight = Dimensions.get("window").height;
  const scrollViewStyle = Platform.select({
    web: { flex: 1, overflow: "auto", maxHeight: screenHeight },
    default: { flex: 1 },
  });

  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: colors.bg },
        Platform.OS === "web" && { height: screenHeight },
      ]}
      edges={["top", "bottom"]}
    >
      {/* Cabeçalho com seta igual ao Privacy */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          paddingTop: Platform.OS === "android" ? 40 : 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 12 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>
          Central de Ajuda
        </Text>
      </View>

      <ScrollView
        style={scrollViewStyle}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={Platform.OS !== "web"}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        overScrollMode="never"
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Banner introdutório */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: teal,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Ionicons name="help-buoy-outline" size={24} color={teal} />
          <Text
            style={{
              color: colors.textSub || colors.text,
              fontSize: 13,
              flex: 1,
              lineHeight: 19,
            }}
          >
            Tire suas dúvidas sobre como usar o Wavunder e entender seus dados
            de consumo.
          </Text>
        </View>

        {/* Cards de FAQ — mesmo estilo dos cards de Privacidade */}
        {FAQ.map((item, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Título da pergunta com ícone */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <Ionicons name={item.icone} size={18} color={teal} />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                  fontWeight: "700",
                  flex: 1,
                }}
              >
                {item.pergunta}
              </Text>
            </View>
            {/* Resposta */}
            <Text
              style={{
                color: colors.textSub || colors.text,
                fontSize: 13,
                lineHeight: 21,
              }}
            >
              {item.resposta}
            </Text>
          </View>
        ))}

        {/* Rodapé */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 14,
            marginTop: 4,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ionicons name="code-slash-outline" size={20} color={teal} />
          <Text
            style={{
              color: colors.text,
              fontSize: 13,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Projeto Acadêmico — Wavunder v3
          </Text>
          <Text
            style={{
              color: colors.textSub || colors.text,
              fontSize: 12,
              textAlign: "center",
              lineHeight: 17,
            }}
          >
            Desenvolvido para a disciplina de Desenvolvimento de Sistemas.
            Código-fonte disponível no repositório GitHub do projeto.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
