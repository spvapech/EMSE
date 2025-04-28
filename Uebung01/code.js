function random_int(max) {
    return document.new_random_integer(max);
}

function random_name(options) {
    return options[random_int(options.length)];
}

document.experiment_definition({
    experiment_name: "EMSE Java Codeverständnis (mit generischen Variablen)",
    seed: "42",
    introduction_pages: [
        "Willkommen zum Java-Codeverständnis-Experiment.\n\nDu wirst gleich zufällige Java-Codebeispiele sehen.\nGib jeweils die Ausgabe der letzten Zeile (System.out.println) als Ziffer 0–9 ein.\n\nDrücke [Enter], um zu starten."
    ],
    pre_run_instruction: "Bereit? Drücke [Enter] für die erste Aufgabe.",
    finish_pages: [
        "Danke! Du hast das Experiment abgeschlossen.\nDrücke [Enter], um deine Ergebnisse zu speichern."
    ],
    layout: [
        { variable: "CodeFormat", treatments: ["mitKommentar", "ohneKommentar"] }
    ],
    repetitions: 10,
    accepted_responses: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],

    task_configuration: (t) => {
        const varNames = {
            x: random_name(["x", "val", "num", "digit"]),
            a: random_name(["a", "num1", "left", "start"]),
            b: random_name(["b", "num2", "right", "end"]),
            sum: random_name(["sum", "total", "result", "output"]),
            loopVar: random_name(["i", "j", "k"]),
            arr: random_name(["arr", "numbers", "values", "data"]),
            idx: random_name(["i", "pos", "index"]),
            v: random_name(["v", "input", "value", "factor"]),
            resultVar: random_name(["res", "result", "output", "final"])
        };

        const codeVariants = [

            // Variante 1: Direkte Ausgabe
            () => {
                const val = random_int(10);
                return {
                    code: [
                        `int ${varNames.x} = ${val};`,
                        `System.out.println(${varNames.x});`
                    ],
                    result: val,
                    meta: { val, var: varNames.x }
                };
            },

            // Variante 2: Addition mit Modulo
            () => {
                const a = random_int(5);
                const b = random_int(5);
                const res = (a + b) % 10;
                return {
                    code: [
                        `int ${varNames.a} = ${a};`,
                        `int ${varNames.b} = ${b};`,
                        `int ${varNames.sum} = (${varNames.a} + ${varNames.b}) % 10;`,
                        `System.out.println(${varNames.sum});`
                    ],
                    result: res,
                    meta: { a, b, varA: varNames.a, varB: varNames.b, sumVar: varNames.sum }
                };
            },

            // Variante 3: Schleifensumme
            () => {
                const n = random_int(4) + 2;
                let sum = 0;
                for (let i = 1; i <= n; i++) sum += i;
                return {
                    code: [
                        `int n = ${n};`,
                        `int ${varNames.sum} = 0;`,
                        `for (int ${varNames.loopVar} = 1; ${varNames.loopVar} <= n; ${varNames.loopVar}++) {`,
                        `    ${varNames.sum} += ${varNames.loopVar};`,
                        `}`,
                        `System.out.println(${varNames.sum});`
                    ],
                    result: sum,
                    meta: { n, sum, sumVar: varNames.sum, loop: varNames.loopVar }
                };
            },

            // Variante 4: Multiplikation + Modulo
            () => {
                const v = random_int(5) + 1;
                const res = (v * 3) % 10;
                return {
                    code: [
                        `int ${varNames.v} = ${v};`,
                        `int ${varNames.resultVar} = (${varNames.v} * 3) % 10;`,
                        `System.out.println(${varNames.resultVar});`
                    ],
                    result: res,
                    meta: { v, var: varNames.v, outVar: varNames.resultVar }
                };
            },

            // Variante 5: Array-Zugriff
            () => {
                const arr = [3, 7, 9, 1, 5];
                const idx = random_int(arr.length);
                return {
                    code: [
                        `int[] ${varNames.arr} = {3, 7, 9, 1, 5};`,
                        `System.out.println(${varNames.arr}[${idx}]);`
                    ],
                    result: arr[idx],
                    meta: { arr: varNames.arr, idx }
                };
            }
        ];

        const variant = codeVariants[random_int(codeVariants.length)]();
        const lines = variant.code;
        const result = variant.result;
        const meta = variant.meta;
        const addComment = t.treatment_combination[0].value === "mitKommentar";

        const commentedCode = lines.map((line) => {
            if (!addComment) return line;

            // Ausgabe-Kommentare
            if (line.includes("System.out.println")) {
                if (meta?.idx !== undefined) return line + `  // Gibt die ${meta.idx + 1}. Stelle des Arrays aus`;
                return line + "  // Gibt die berechnete Ausgabe aus";
            }

            // Direkte Zuweisung
            if (line.includes(`int ${meta?.var} =`)) return line + `  // Variable mit Wert ${meta.val}`;

            // Addition
            if (line.includes(`int ${meta?.varA} =`)) return line + `  // Erste Zahl (${meta.a})`;
            if (line.includes(`int ${meta?.varB} =`)) return line + `  // Zweite Zahl (${meta.b})`;
            if (line.includes("% 10")) return line + `  // Ergebnis modulo 10`;

            // Schleife
            if (line.includes("int n =")) return line + `  // n = ${meta.n}, Schleife läuft ${meta.n}×`;
            if (line.includes("for")) return line + `  // Schleife summiert Zahlen von 1 bis n`;
            if (line.includes("+=") && meta?.sumVar)
                return line + `  // Addiert laufende Zahl zu ${meta.sumVar}`;

            // Array
            if (line.includes("int[]")) return line + `  // Array mit festen Zahlen`;
            if (line.includes("[") && line.includes("]") && meta?.idx !== undefined)
                return line + `  // Gibt die ${meta.idx + 1}. Stelle des Arrays aus`;

            return line + "  // Nächster Schritt im Code";
        });

        t.code = commentedCode.join("\n");
        t.expected_answer = "" + result;
        t.after_task_string = () => "Nächste Aufgabe folgt...";
    }
});