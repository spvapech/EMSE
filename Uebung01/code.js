// Das Beispielexperiment erzeugt als Fragen nur die Zahlen 0-9.
// Ein Experimentteilnehmer kann die Zahlen 1-3 drücken
//
// Die Experimentdefinition erfolgt über Aufruf der Funktion
//  - document.experiment_definition(...)
// Falls eine Zufallszahl benötigt wird, erhält man sie durch den Methodenaufruf
//  - document.new_random_integer(...Obergrenze...);
//
// WICHTIG: Man sollte new_random_integer nur innerhalb  der Lambda-Funktion ausführen, also NICHT
// an einer anderen Stelle, damit man ein reproduzierbares Experiment erhält!

function random_int() {
    return document.new_random_integer(10);
}

function random_bool() {
    return document.new_random_integer(2) > 0;
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name:"Stefan First Trial",
        seed:"42",
        introduction_pages:["Interessiert mich nicht.\n\nPress [Enter] to continue."],
        pre_run_instruction:"Gleich gehts los.\n\nWhen you press [Enter] the tasks directly start.",
        finish_pages:["Thanks for nothing. When you press [Enter], the experiment's data will be downloaded."],
        layout:[
            {variable:"AVariable",treatments:["A", "B"]}
        ],
        repetitions:4,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses:["0", "1","2","3", "4", "5", "6", "7", "8", "9"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        task_configuration:(t)=>{
            // Das hier ist der Code, der jeder Task im Experiment den Code zuweist.
            // Im Feld code steht der Quellcode, der angezeigt wird,
            // in "expected_answer" das, was die Aufgabe als Lösung erachtet
            // In das Feld "given_answer" trägt das Experiment ein, welche Taste gedrückt wurde
            //
            // Ein Task-Objekt hat ein Feld treatment_combination, welches ein Array von Treatment-Objekten ist.
            // Ein Treatment-Objekt hat zwei Felder:
            //     variable - Ein Variable-Objekt, welches das Feld name hat (der Name der Variablen);
            //     value - Ein String, in dem der Wert des Treatments steht.

            if (t.treatment_combination[0].value=="A")
                t.code = "Dummy"
            else
                t.code = "Another Dummy";

            t.expected_answer = "" + random_int();


            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            t.after_task_string = ()=>"Some nice text between the tasks";
        }
    }
);