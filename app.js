import colors from "colors";
import {
  inquirerMenu,
  pausa,
  leerInput,
  listadoBorrarTareas,
  confirmar,
  mostrarListadoChecklist,
} from "./helpers/inquirer.js";
import { guardarDB, leerDB } from "./helpers/guardarArchivo.js";

import { Tareas } from "./models/tareas.js";

console.clear();

const main = async () => {
  let opt = "";
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    //Cargar las tareas
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        //Crear tarea
        const desc = await leerInput("Descripción:");
        tareas.crearTarea(desc);
        break;

      case "2": // Listar tareas
        tareas.listadoCompleto();
        break;

      case "3": // Listar completadas
        tareas.listarPendientesCompletadas(true);
        break;

      case "4": // Listar pendientes
        tareas.listarPendientesCompletadas(false);
        break;

      case "5": // completado | pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;

      case "6": // Borrar tarea
        const id = await listadoBorrarTareas(tareas.listadoArr);
        if (id !== "0") {
          const ok = await confirmar("¿Está seguro?");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada correctamente");
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();
  } while (opt !== "0");
};

main();
