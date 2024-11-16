# Historia de Usuario: Gestión de Citas para Clínica

## Contexto del Caso Práctico: Gestión de Citas para Clínica

Como parte de este assessment, se te asigna un proyecto que simula un entorno real. Has sido contratado como parte de un equipo junior para desarrollar un sistema de gestión de citas para una clínica privada. A continuación, se detallan los problemas identificados en la clínica y los objetivos de la solución esperada:

### Problemas que enfrenta la clínica:

#### 1. Conflictos de horario:
- **a.** En más de una ocasión, se han registrado dos citas al mismo tiempo para el mismo médico, lo que provoca que algunos pacientes deban ser reprogramados a último momento. Esto no solo genera frustración entre los pacientes, sino también afecta la organización diaria de los médicos, quienes se ven forzados a ajustar su horario sobre la marcha.
- **b.** Además, no existe un sistema que controle si un médico está disponible en un momento determinado, lo que genera incertidumbre al momento de agendar citas.

#### 2. Citas duplicadas:
- **a.** La clínica ha notado que, en ciertos casos, algunos pacientes reciben doble confirmación de citas o terminan con más de una cita asignada para el mismo problema médico. Esto se debe a que, al gestionar manualmente, el personal puede perder el control sobre los registros previos de las citas. Como resultado, se está perdiendo tiempo valioso, y en algunos casos, citas importantes se olvidan o se cancelan sin previo aviso.

#### 3. Falta de seguimiento del historial de citas:
- **a.** Actualmente, la clínica no cuenta con un registro detallado del historial de citas de cada paciente. Esto significa que, cuando un paciente regresa, el personal administrativo o los médicos no pueden ver fácilmente sus citas anteriores, lo que dificulta la revisión del historial médico relacionado con esas citas. En algunos casos, los médicos solicitan información repetida a los pacientes debido a la falta de este seguimiento.
- **b.** El personal administrativo ha intentado llevar un registro manual en hojas de cálculo, pero esto ha demostrado ser poco práctico y propenso a errores, especialmente cuando el volumen de pacientes aumenta. Necesitan una forma de acceder y revisar el historial de citas de cada paciente de manera sencilla y sin complicaciones.

#### 4. Dificultad para visualizar la disponibilidad de los médicos:
- **a.** El personal de la clínica ha reportado que no tienen una vista clara del horario de los médicos. A menudo, tienen que revisar varias hojas de cálculo para saber si un médico está disponible o no. Esto ralentiza el proceso de agendamiento, y en más de una ocasión se han agendado citas en horarios no disponibles.
- **b.** También se ha observado que cuando un médico está ausente o debe cancelar una cita por un imprevisto, no hay una forma eficiente de reprogramar a los pacientes de manera automática, lo que genera una sobrecarga en la gestión manual.

### Objetivo de la Solución:
La clínica está buscando una solución tecnológica que elimine los problemas actuales y haga que la gestión de citas sea más eficiente y menos propensa a errores. El sistema debe permitir a diferentes personas (médicos y pacientes) interactuar con la información de las citas de forma sencilla y clara. Para lograr esto, la solución debe:
- Permitir que diferentes usuarios accedan al sistema de forma independiente, desde distintos lugares dentro de la clínica o incluso desde fuera de ella, dependiendo de su rol.
- Mantener la información organizada de manera centralizada, de modo que no haya confusión o duplicación de citas, y cada usuario pueda ver lo que necesita sin tener que consultar otras personas.
- Facilitar la visualización de la disponibilidad de los médicos y las citas programadas de manera rápida, clara y fácil de actualizar cuando sea necesario.

Es importante que el sistema sea fácil de usar para cualquier persona, sin importar su experiencia técnica. Además, debe ser flexible y preparado para crecer, para que el cliente pueda agregar nuevas funcionalidades o integrar otras herramientas en el futuro si fuera necesario, sin tener que cambiar todo el sistema.

## Criterios de Aceptación:
- Poder registrarme, loguearme e interactuar con base a mi rol.
- No debe permitir agendar dos citas en el mismo horario para un médico.
- Debe actualizar la disponibilidad en tiempo real cuando se agenda una cita.
- Debe mostrar advertencias cuando se intenta agendar en un horario ocupado.
- Incluir información sobre el motivo de cada cita.
- Permitir filtrar citas por fecha, especialidad o motivo.
- Permitir agregar notas o comentarios a cada cita.
- Los usuarios solo pueden ver la información pertinente a su rol.

## Listado de entregables:
- Documentación (readme, diagramas, casos de uso, etc.).
- Enlace al/los repositorios.
- Valores de variables de entorno en archivo o archivos `.env`.
- Base de datos desplegadas y pobladas.

## Adicionales (Opcional):
- **Notificaciones en tiempo real:** Implementar notificaciones en tiempo real mediante WebSockets o una herramienta como Pusher para alertar a los usuarios sobre eventos importantes (nuevas citas, cambios en el horario de un médico, cancelaciones o recordatorios). La funcionalidad debe permitir notificaciones push que lleguen al navegador o al dispositivo móvil, diferenciando por rol (por ejemplo, avisos de confirmación para pacientes o notificaciones de disponibilidad a médicos).
- **Pruebas avanzadas:** Crear un conjunto robusto de pruebas, incluyendo:
  - Pruebas de integración y de extremos a extremos (E2E), que abarquen el flujo de usuario completo, como el registro, programación de citas, filtrado y visualización de disponibilidad.
- **Despliegue en la nube:** Configurar el sistema para que escale automáticamente y mantenga su disponibilidad, usando monitoreo para revisar su estado y rendimiento.
- **Tablero de gestión en Azure DevOps:** Crear un tablero que permita a los desarrolladores y stakeholders gestionar el ciclo de vida del desarrollo, facilitando el seguimiento de tareas y prioridades en tiempo real. Incluir métricas como progreso de desarrollo, estado de los despliegues y bugs identificados. Dicho proyecto en Azure DevOps debe ser nombrado como *Assessment-Clan(NombreCompleto)*, ejemplo: *Assessment-Ritchie(PepitoPerez)*.
