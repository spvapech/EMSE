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

var myStuff = [];
for (let i = 0; i < 10; i++) {
    myStuff.push("" + i);
}

var counter = 0;

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name:"TestExperiment",
        seed:"42",
        introduction_pages:["This should explain the experiment.\n\nPress [Enter] to continue."],
        pre_run_instruction:"Please, put your fingers now on the keys [1]-[3]. These are the only possible inputs in a task.\n\nWhen you press [Enter] the tasks directly start.",
        finish_pages:["Almost done. When you press [Enter], the experiment's data will be downloaded."],
        layout:[
            {variable:"Counter",treatments:["1","2","3","4","5"]}
        ],
        repetitions:2,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses:["1","2","3"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        task_configuration:(t)=>{
            // Das hier ist der Code, der jeder Task im Experiment den Code zuweist.
            // Im Feld code steht der Quellcode, der angezeigt wird,
            // in "expected_answer" das, was die Aufgabe als Lösung erachtet
            // In das Feld "given_answer" trägt das Experiment ein, welche Taste gedrückt wurde
            t.code="Task " + myStuff[counter] + " + Zufallszahl " + document.new_random_integer(5);
            t.expected_answer = "1";

            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            t.after_task_string = ()=>"Some nice text between the tasks";
            counter++;

            // Nicht vergessen: Es werden mehr als 10 Aufgaben generiert, da auch
            // Trainingssets generiert werden.
            if(counter==10) counter=0;
        }
    }
);