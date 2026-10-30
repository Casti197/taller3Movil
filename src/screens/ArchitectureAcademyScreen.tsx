import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export const ArchitectureAcademyScreen: React.FC = () => {
  // Step in Flux interactive diagram
  const [activeStep, setActiveStep] = useState(1);
  const [showGoodPattern, setShowGoodPattern] = useState(true);

  // Rubric check states
  const [rubricItems, setRubricItems] = useState([
    { id: 1, title: '1. Configuración de Store & Slices (RTK)', points: 25, checked: true, desc: 'Uso estricto de configureStore, múltiples slices modulares (statsSlice, inventorySlice, actionLogSlice), reducers con Immer y acciones tipadas.' },
    { id: 2, title: '2. Pureza & Estado Derivado (Selectores)', points: 20, checked: true, desc: 'Evitar redundancia: las estadísticas dinámicas (peso total, sobrecarga, poder de combate) se calculan mediante selectores memoizados.' },
    { id: 3, title: '3. Reactividad & Feedback Visual', points: 25, checked: true, desc: 'La interfaz refleja de inmediato los dispatches: barras reactivas, cambio de badges y auras, y stream de auditoría en vivo.' },
    { id: 4, title: '4. Claridad en Video & Argumentación (5-7 min)', points: 30, checked: true, desc: 'Explicación oral fluida respetando la ventana de tiempo, dominio del flujo Action -> Reducer -> Store -> Selector y cuándo usar useState vs Redux.' },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const toggleRubric = (id: number) => {
    setRubricItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const totalScore = rubricItems
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.points, 0);

  const fluxSteps = [
    {
      step: 1,
      badge: '01. UI',
      title: 'Componente Vista',
      desc: 'Dispara acción ante evento de usuario (e.g. Equipar Ítem).',
      log: '> HeroInventory.tsx invoca dispatch(toggleEquipItem("item_sword"))',
      icon: 'touch-app' as const,
      color: theme.colors.primary,
    },
    {
      step: 2,
      badge: '02. DISPATCH',
      title: 'dispatch(action)',
      desc: 'Emite objeto con type y payload hacia el middleware pipeline.',
      log: '> Dispatch: { type: "inventory/toggleEquipItem", payload: "item_sword" }',
      icon: 'bolt' as const,
      color: theme.colors.tertiary,
    },
    {
      step: 3,
      badge: '03. REDUCER',
      title: 'Immer Engine',
      desc: 'Mutación sintáctica directa. Produce un nuevo snapshot inmutable.',
      log: '> Immer Draft: draftState.equippedIds.push(action.payload) produce frozen state tree',
      icon: 'memory' as const,
      color: theme.colors.secondary,
    },
    {
      step: 4,
      badge: '04. STORE',
      title: 'Single Source',
      desc: 'Árbol de estado global consolidado y notificador de cambios.',
      log: '> Redux Store: Root state tree actualizado. Notificando a selectores suscritos.',
      icon: 'storage' as const,
      color: theme.colors.primary,
    },
    {
      step: 5,
      badge: '05. SELECTOR',
      title: 'Estado Derivado',
      desc: 'Calcula estadísticas (ATK total, Sobrecarga) sin duplicar datos.',
      log: '> Selector Memo: selectHeroComputedStatus recalculado al instante. Zero store bloat.',
      icon: 'filter-alt' as const,
      color: theme.colors.tertiary,
    },
    {
      step: 6,
      badge: '06. RE-RENDER',
      title: 'Actualización UI',
      desc: 'Solo los suscriptores al selector relevante mutan su visual.',
      log: '> Viewport Sync: HeroAvatarHUD & ArmoryGrid sincronizados simultáneamente.',
      icon: 'motion-photos-on' as const,
      color: theme.colors.primary,
    },
  ];

  const currentFlux = fluxSteps.find((s) => s.step === activeStep) || fluxSteps[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Toast Feedback */}
      {toastMsg && (
        <View style={styles.toast}>
          <MaterialIcons name="check-circle" size={16} color={theme.colors.tertiary} />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}

      {/* Pedagogical Hero Section */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.protocolBadge}>
            <MaterialIcons name="school" size={16} color={theme.colors.primary} />
            <Text style={styles.protocolText}>PROTOCOLO DE EVALUACIÓN</Text>
          </View>
          <View style={styles.modulesBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.modulesText}>4/4 MÓDULOS ACTIVOS</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Redux Architecture Academy</Text>
        <Text style={styles.heroDesc}>
          Manual táctico de preparación para video-demostración (5 a 7 min). Domina el flujo unidireccional y asegura la puntuación máxima de 100 PTS.
        </Text>

        <View style={styles.progressBox}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Preparación de Defensa Técnica</Text>
            <Text style={styles.progressValue}>100% LISTO</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
          <View style={styles.progressStages}>
            <Text style={styles.stageText}>STORE &amp; SLICES</Text>
            <Text style={styles.stageText}>DERIVED STATE</Text>
            <Text style={styles.stageText}>UI REACTIVITY</Text>
            <Text style={styles.stageText}>VIDEO PITCH</Text>
          </View>
        </View>
      </View>

      {/* Visual Interactive Flux Diagram */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="sync-alt" size={18} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>CICLO UNIDIRECCIONAL RTK</Text>
          </View>
          <Text style={styles.interactiveTag}>Interactivo</Text>
        </View>

        <Text style={styles.sectionSub}>
          Toca cada nodo táctico para simular el pulso de ejecución y explicar el flujo en tu video demostrativo:
        </Text>

        <View style={styles.fluxGrid}>
          {fluxSteps.map((step) => {
            const isSelected = activeStep === step.step;
            return (
              <TouchableOpacity
                key={step.step}
                style={[styles.fluxCard, isSelected && styles.fluxCardActive]}
                onPress={() => setActiveStep(step.step)}
                activeOpacity={0.7}
              >
                <View style={styles.fluxCardHeader}>
                  <View style={[styles.stepBadge, { backgroundColor: `${step.color}25` }]}>
                    <Text style={[styles.stepBadgeText, { color: step.color }]}>{step.badge}</Text>
                  </View>
                  <MaterialIcons name={step.icon} size={16} color={step.color} />
                </View>
                <Text style={styles.fluxCardTitle}>{step.title}</Text>
                <Text style={styles.fluxCardDesc}>{step.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Telemetry Live Feed Terminal */}
        <View style={styles.fluxTerminal}>
          <View style={styles.fluxTerminalHeader}>
            <View style={styles.terminalPulseRow}>
              <View style={styles.greenDot} />
              <Text style={styles.terminalTitle}>TELEMETRÍA EN VIVO DEL TALLER</Text>
            </View>
            <Text style={styles.terminalSelectedStep}>NODO: {currentFlux.badge}</Text>
          </View>
          <View style={styles.terminalBody}>
            <Text style={styles.terminalText}>{currentFlux.log}</Text>
          </View>
        </View>
      </View>

      {/* Video Pitch Script: 4 Critical Moments (5 to 7 min) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="videocam" size={18} color={theme.colors.secondary} />
            <Text style={styles.sectionTitle}>GUION DEL VIDEO (5-7 MIN)</Text>
          </View>
          <Text style={styles.structureTag}>ESTRUCTURA TÁCTICA</Text>
        </View>

        <View style={styles.momentsStack}>
          {/* Moment 1 */}
          <View style={styles.momentCard}>
            <View style={styles.momentHeader}>
              <View style={styles.momentBadge}>
                <Text style={styles.momentBadgeText}>MOMENTO 1 | 0:00 - 1:30</Text>
              </View>
              <Text style={styles.momentDuration}>90 Segundos</Text>
            </View>
            <Text style={styles.momentTitle}>El Problema: Prop Drilling vs Store Central</Text>
            <Text style={styles.momentDesc}>
              Muestra tu app corriendo y explica: "¿Qué pasaría si intentáramos conectar el Avatar Superior, la Armería, el Panel de Atributos y la Consola usando solo useState y pasando props?" Explica el ciclo unidireccional: UI → Dispatch → Reducer → Store → Selector → Re-render.
            </Text>
            <View style={styles.keyPhraseBox}>
              <MaterialIcons name="check-circle" size={14} color={theme.colors.tertiary} />
              <Text style={styles.keyPhraseText}>
                <Text style={{ fontWeight: '700', color: theme.colors.tertiary }}>Frase Clave: </Text>
                "Centralizar el estado evita sincronización manual y elimina el acoplamiento frágil entre ramas de la interfaz."
              </Text>
            </View>
          </View>

          {/* Moment 2 */}
          <View style={styles.momentCard}>
            <View style={styles.momentHeader}>
              <View style={[styles.momentBadge, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={[styles.momentBadgeText, { color: theme.colors.tertiary }]}>
                  MOMENTO 2 | 1:30 - 3:30
                </Text>
              </View>
              <Text style={styles.momentDuration}>120 Segundos</Text>
            </View>
            <Text style={styles.momentTitle}>El "Efecto Dominó" en Vivo</Text>
            <Text style={styles.momentDesc}>
              Interactúa con la app en vivo mostrando cómo un solo toque (equipar Armadura Maldita o aplicar preset Guerrero) actualiza simultáneamente la barra de peso, cambia el color/aura del Avatar, recalcula el Poder de Combate y registra la acción en el Inspector.
            </Text>
            <View style={styles.keyPhraseBox}>
              <MaterialIcons name="check-circle" size={14} color={theme.colors.tertiary} />
              <Text style={styles.keyPhraseText}>
                <Text style={{ fontWeight: '700', color: theme.colors.tertiary }}>Frase Clave: </Text>
                "Un solo dispatch desencadena actualizaciones reactivas coherentes en al menos 4 zonas independientes sin pasar props."
              </Text>
            </View>
          </View>

          {/* Moment 3 */}
          <View style={styles.momentCard}>
            <View style={styles.momentHeader}>
              <View style={[styles.momentBadge, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Text style={[styles.momentBadgeText, { color: theme.colors.secondary }]}>
                  MOMENTO 3 | 3:30 - 5:30
                </Text>
              </View>
              <Text style={styles.momentDuration}>120 Segundos</Text>
            </View>
            <Text style={styles.momentTitle}>Inspección de Código: Slices, Immer y Selectores</Text>
            <Text style={styles.momentDesc}>
              Abre el código fuente. Muestra cómo configuraste configureStore, explica cómo createSlice maneja la inmutabilidad por debajo mediante Immer (permitiendo sintaxis directa) y muestra tu archivo selectors.ts destacando el cálculo memoizado del poder total y la sobrecarga.
            </Text>
            <View style={styles.keyPhraseBox}>
              <MaterialIcons name="check-circle" size={14} color={theme.colors.tertiary} />
              <Text style={styles.keyPhraseText}>
                <Text style={{ fontWeight: '700', color: theme.colors.tertiary }}>Frase Clave: </Text>
                "Prohibido guardar cálculos en el estado: el peso total y el poder son estados derivados puros."
              </Text>
            </View>
          </View>

          {/* Moment 4 */}
          <View style={styles.momentCard}>
            <View style={styles.momentHeader}>
              <View style={styles.momentBadge}>
                <Text style={styles.momentBadgeText}>MOMENTO 4 | 5:30 - 6:30</Text>
              </View>
              <Text style={styles.momentDuration}>60 Segundos</Text>
            </View>
            <Text style={styles.momentTitle}>Cierre Crítico: useState vs Redux Toolkit</Text>
            <Text style={styles.momentDesc}>
              Cierra respondiendo: ¿Cuándo usar estado local y cuándo escalar a Redux? useState para estado efímero de UI (modales locales, toggles de animación, inputs). Redux Toolkit para reglas de dominio compartidas por múltiples vistas y auditoría global.
            </Text>
            <View style={styles.keyPhraseBox}>
              <MaterialIcons name="check-circle" size={14} color={theme.colors.tertiary} />
              <Text style={styles.keyPhraseText}>
                <Text style={{ fontWeight: '700', color: theme.colors.tertiary }}>Frase Clave: </Text>
                "Redux para el dominio compartido del negocio; useState para estados transitorios y componentes aislados."
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Code Snippet Comparator */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="code" size={18} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>COMPARADOR DE CÓDIGO RTK</Text>
          </View>
          <View style={styles.toggleButtonsRow}>
            <TouchableOpacity
              style={[styles.toggleCodeBtn, !showGoodPattern && styles.toggleCodeBtnBad]}
              onPress={() => setShowGoodPattern(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleCodeBtnText, !showGoodPattern && { color: theme.colors.secondary }]}>
                Antipatrón
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleCodeBtn, showGoodPattern && styles.toggleCodeBtnGood]}
              onPress={() => setShowGoodPattern(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleCodeBtnText, showGoodPattern && { color: theme.colors.onPrimary }]}>
                Selector Puro
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.codeSnippetCard}>
          <View style={styles.snippetHeaderRow}>
            <Text style={styles.snippetFileName}>
              {showGoodPattern ? 'src/store/selectors.ts (RECOMENDADO)' : 'src/slices/statsSlice.ts (ANTIPATRÓN)'}
            </Text>
            <View
              style={[
                styles.snippetBadge,
                showGoodPattern
                  ? { backgroundColor: 'rgba(16, 185, 129, 0.2)' }
                  : { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
              ]}
            >
              <Text
                style={[
                  styles.snippetBadgeText,
                  showGoodPattern ? { color: theme.colors.tertiary } : { color: theme.colors.secondary },
                ]}
              >
                {showGoodPattern ? 'BUENA PRÁCTICA' : 'PROHIBIDO'}
              </Text>
            </View>
          </View>

          <Text style={styles.snippetCodeText}>
            {showGoodPattern
              ? `// BIEN: El estado almacena solo la fuente de la verdad
export const selectTotalWeight = (state: RootState) =>
  state.inventory.catalog
    .filter(i => state.inventory.equippedIds.includes(i.id))
    .reduce((acc, i) => acc + i.weight, 0);

export const selectIsOverloaded = createSelector(
  [selectTotalWeight, (state: RootState) => 10 + (state.stats.str * 2)],
  (totalWeight, maxCapacity) => totalWeight > maxCapacity
);`
              : `// MAL: Guardar datos calculados en el estado provoca desincronización
const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    totalWeight: 0,       // ❌ REDUNDANTE
    isOverloaded: false,  // ❌ REDUNDANTE
    combatPower: 40       // ❌ REDUNDANTE
  },
  reducers: {
    // Requiere actualizar 4 campos en cada toggle de inventario
    toggleEquipManual: (state, action) => {
      state.totalWeight += action.payload.weight;
      state.isOverloaded = state.totalWeight > state.maxCapacity;
    }
  }
});`}
          </Text>

          <Text style={styles.snippetExplanation}>
            {showGoodPattern
              ? 'El estado derivado se computa en memoria a través de selectores memoizados. Cero riesgo de desincronización y sin inflar el árbol de Redux.'
              : 'Antipatrón riesgoso: al almacenar totalWeight y combatPower en el slice, corres el riesgo de que una mutación externa olvide recalcularlos, generando inconsistencias visuales en la app.'}
          </Text>
        </View>
      </View>

      {/* Interactive Evaluation Rubric Simulator (100 PTS) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="grading" size={18} color={theme.colors.tertiary} />
            <Text style={styles.sectionTitle}>SIMULADOR DE RÚBRICA (100 PTS)</Text>
          </View>
          <Text style={styles.rubricScoreText}>{totalScore} / 100 PTS</Text>
        </View>

        <Text style={styles.sectionSub}>
          Marca los criterios cubiertos para auto-evaluar tu entrega antes de subir el video definitivo:
        </Text>

        <View style={styles.rubricStack}>
          {rubricItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.rubricCard, !item.checked && styles.rubricCardUnchecked]}
              onPress={() => toggleRubric(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.rubricTop}>
                <View style={styles.rubricLeft}>
                  <View
                    style={[
                      styles.checkbox,
                      item.checked && styles.checkboxChecked,
                    ]}
                  >
                    {item.checked && (
                      <MaterialIcons name="check" size={14} color={theme.colors.onPrimary} />
                    )}
                  </View>
                  <Text style={styles.rubricItemTitle}>{item.title}</Text>
                </View>
                <View style={styles.rubricPointsBadge}>
                  <Text style={styles.rubricPointsText}>{item.points} PTS</Text>
                </View>
              </View>
              <Text style={styles.rubricItemDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recording Checklist & Copy Action */}
      <View style={styles.checklistCard}>
        <View style={styles.checklistHeader}>
          <MaterialIcons name="assignment-turned-in" size={18} color={theme.colors.primary} />
          <Text style={styles.checklistTitle}>CHECKLIST DE GRABACIÓN</Text>
        </View>

        <View style={styles.checklistRow}>
          <MaterialIcons name="mic" size={16} color={theme.colors.tertiary} />
          <Text style={styles.checklistLabel}>Audio claro sin eco y emulador visible a 1080p</Text>
          <Text style={styles.checklistTag}>LISTO</Text>
        </View>

        <View style={styles.checklistRow}>
          <MaterialIcons name="timer" size={16} color={theme.colors.tertiary} />
          <Text style={styles.checklistLabel}>Cronómetro visible para respetar la ventana 5-7 min</Text>
          <Text style={styles.checklistTag}>CONFIGURADO</Text>
        </View>

        <View style={styles.checklistRow}>
          <MaterialIcons name="link" size={16} color={theme.colors.tertiary} />
          <Text style={styles.checklistLabel}>Repositorio GitHub con Slices, Selectores y README</Text>
          <Text style={styles.checklistTag}>VERIFICADO</Text>
        </View>

        <TouchableOpacity
          style={styles.copyScriptBtn}
          onPress={() => showToast('¡Estructura de 4 momentos copiada!')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="content-copy" size={16} color={theme.colors.onPrimary} />
          <Text style={styles.copyScriptText}>COPIAR ESTRUCTURA DEL GUION</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: theme.spacing.base,
    gap: theme.spacing.base,
    paddingBottom: 40,
  },
  toast: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  toastText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.tertiary,
  },
  heroCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  protocolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  protocolText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  modulesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tertiary,
  },
  modulesText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.tertiary,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  heroDesc: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 16,
  },
  progressBox: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    gap: 6,
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 10,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.tertiary,
    fontFamily: 'monospace',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.tertiary,
  },
  progressStages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageText: {
    fontSize: 8,
    fontFamily: 'monospace',
    color: theme.colors.outline,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  interactiveTag: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  sectionSub: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
  },
  fluxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fluxCard: {
    width: '48%',
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.md,
    padding: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  fluxCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  fluxCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.sm,
  },
  stepBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  fluxCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  fluxCardDesc: {
    fontSize: 9,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 12,
  },
  fluxTerminal: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.md,
    padding: 8,
    gap: 6,
  },
  fluxTerminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  terminalPulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  terminalTitle: {
    fontSize: 8,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  terminalSelectedStep: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  terminalBody: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: theme.borderRadius.sm,
    padding: 6,
  },
  terminalText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.primary,
  },
  structureTag: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.outline,
  },
  momentsStack: {
    gap: 10,
  },
  momentCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 6,
  },
  momentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  momentBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  momentBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  momentDuration: {
    fontSize: 10,
    color: theme.colors.outline,
    fontFamily: 'monospace',
  },
  momentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  momentDesc: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 16,
  },
  keyPhraseBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.sm,
    padding: 8,
  },
  keyPhraseText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    flex: 1,
  },
  toggleButtonsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.sm,
    padding: 2,
  },
  toggleCodeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  toggleCodeBtnGood: {
    backgroundColor: theme.colors.primary,
  },
  toggleCodeBtnBad: {
    backgroundColor: theme.colors.secondaryContainer,
  },
  toggleCodeBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  codeSnippetCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  snippetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snippetFileName: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: theme.colors.primary,
  },
  snippetBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  snippetBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  snippetCodeText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.surfaceContainerHigh,
    padding: 10,
    borderRadius: theme.borderRadius.md,
    lineHeight: 15,
  },
  snippetExplanation: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 15,
  },
  rubricScoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.tertiary,
    fontFamily: 'monospace',
  },
  rubricStack: {
    gap: 8,
  },
  rubricCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 6,
  },
  rubricCardUnchecked: {
    opacity: 0.5,
  },
  rubricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rubricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  rubricItemTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  rubricPointsBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  rubricPointsText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  rubricItemDesc: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 14,
    paddingLeft: 28,
  },
  checklistCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checklistTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.sm,
    padding: 8,
    gap: 8,
  },
  checklistLabel: {
    fontSize: 10,
    color: theme.colors.onSurface,
    flex: 1,
  },
  checklistTag: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: theme.colors.tertiary,
  },
  copyScriptBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  copyScriptText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.onPrimary,
  },
});
