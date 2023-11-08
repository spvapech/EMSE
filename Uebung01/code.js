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

function create_statement(depth) {
    if(depth==1) {
        return new Return(random_int());
    } else if (depth==2) {
        let if_statement = new IfStatement();
        if_statement.condition = random_bool();
        if_statement.then_branch = new Return(random_int())
        if_statement.else_branch = new Return(random_int());
        return if_statement;

    } else if (depth > 2) {
        let if_statement = new IfStatement();
        if_statement.condition = random_bool();
        if_statement.then_branch = create_statement(depth-1);
        if_statement.else_branch = create_statement(depth-1)        ;
        return if_statement;
    }

    throw "Sollte nicht sein";
}


class Statement {
    indented_code(indentation_level) {}
    non_indented_code() {}

    return_value() {}
}

class Return extends Statement {
    value;
    constructor(value) {
        super();
        this.value=value;
    }

    indented_code(indentation_level) {
        let ret = "    ".repeat(indentation_level);
        ret = ret + "return " + this.value + "\n";
        return ret;
    }

    non_indented_code() {
        let ret = "return " + this.value + "\n";
        return ret;
    }

    return_value() {
        return this.value;
    }
}
class IfStatement extends Statement {
    condition;
    then_branch;
    else_branch;

    indented_code(indentation_level) {
        let ret = "    ".repeat(indentation_level);
        ret = ret + "if (" + this.condition + ") {\n";
        indentation_level = indentation_level + 1;
        ret = ret + this.then_branch.indented_code(indentation_level);
        indentation_level = indentation_level - 1;
        ret = ret + "    ".repeat(indentation_level) + "} else {\n"
        indentation_level = indentation_level + 1;
        ret = ret + this.else_branch.indented_code(indentation_level);
        indentation_level = indentation_level - 1;
        ret = ret + "    ".repeat(indentation_level) + "}\n"
        return ret;
    }

    non_indented_code() {
        let ret = "";
        ret = ret + "if (" + this.condition + ") {\n";
        ret = ret + this.then_branch.non_indented_code();
        ret = ret + "} else {\n"
        ret = ret + this.else_branch.non_indented_code();
        ret = ret + "}\n"
        return ret;
    }

    return_value() {
        if(this.condition==true)
            return this.then_branch.return_value();
        return this.else_branch.return_value();
    }

}

let stmt = create_statement(3);
console.log(stmt.non_indented_code(0));

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name:"Stefan First Trial",
        seed:"42",
        introduction_pages:["Interessiert mich nicht.\n\nPress [Enter] to continue."],
        pre_run_instruction:"Gleich gehts los.\n\nWhen you press [Enter] the tasks directly start.",
        finish_pages:["Thanks for nothing. When you press [Enter], the experiment's data will be downloaded."],
        layout:[
            {variable:"Indentation",treatments:["indented", "non-indented"]},
            {variable:"Scrolling",treatments:["scroll", "non-scroll"]},
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

            let stmt = create_statement(4);
            if (t.treatment_combination[0].value=="indented")
                t.code = stmt.indented_code(0);
            else
                t.code = stmt.non_indented_code();

            t.expected_answer = "" + stmt.return_value();


            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            t.after_task_string = ()=>"Some nice text between the tasks";
        }
    }
);