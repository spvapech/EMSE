let SEED = "42";
Nof1.SET_SEED(SEED);

const experiment_configuration_function = (writer) => {
    function random_int(max) {
        return Nof1.new_random_integer(max);
    }

    function random_name(options) {
        return options[random_int(options.length)];
    }

    return {
        experiment_name: "Java Codeverständnis mit Nof1",
        seed: SEED,

        introduction_pages: writer.stage_string_pages_commands([
            writer.convert_string_to_html_string(
                "Willkommen zum Java-Codeverständnis-Experiment.\n\nBitte nur starten, wenn du konzentriert und motiviert bist.\n\nWechsle bitte in den Vollbildmodus (wahrscheinlich mit [F11])."
            ),
            writer.convert_string_to_html_string(
                "Du wirst Java-Codebeispiele sehen und die Ausgabe der letzten Zeile bestimmen.\n\nDie Aufgaben sind nicht zu schwer."
            )
        ]),

        pre_run_training_instructions: writer.string_page_command(
            writer.convert_string_to_html_string("Du befindest dich jetzt in der Trainingsphase.")
        ),

        pre_run_experiment_instructions: writer.string_page_command(
            writer.convert_string_to_html_string("Die eigentliche Experimentphase beginnt jetzt.")
        ),

        finish_pages: [
            writer.string_page_command(
                writer.convert_string_to_html_string(
                    "Fast fertig. Deine Daten werden jetzt heruntergeladen. Bitte sende die Datei an den Versuchsleiter.\n\nDanach kannst du das Fenster schließen.\n\nVielen Dank für deine Teilnahme!"
                )
            )
        ],

        layout: [
            { variable: "CodeFormat", treatments: ["mitKommentar", "ohneKommentar"] },
            { variable: "CodeVariante", treatments: [
                    "Direktausgabe",      // Direktausgabe des Werts
                    "AdditionMod10",      // Addition zweier Zahlen mit mod 10
                    "Schleifensumme",      // Summieren in einer Schleife
                    "MultiplikationMod10",// Multiplikation mit 3 und mod 10
                    "Arrayzugriff"         // Zugriff auf ein Array-Element
                ]},
        ],

        training_configuration: {
            fixed_treatments: [["CodeFormat", "mitKommentar"]],
            can_be_cancelled: false,
            can_be_repeated: false
        },

        repetitions: 4,

        measurement: Nof1.Reaction_time(Nof1.keys(["0","1","2","3","4","5","6","7","8","9"])),

        task_configuration: (t) => {
            const varNames = {
                x: random_name(["x","val","num","digit"]),
                a: random_name(["a","num1","left","start"]),
                b: random_name(["b","num2","right","end"]),
                sum: random_name(["sum","total","result","output"]),
                loopVar: random_name(["i","j","k"]),
                arr: random_name(["arr","numbers","values","data"]),
                idx: random_name(["i","pos","index"]),
                v: random_name(["v","input","value","factor"]),
                resultVar: random_name(["res","result","output","final"])
            };

            const codeVariants = [
                // Direktausgabe
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

                // Addition mit Modulo 10
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

                // Schleifensumme
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

                // Multiplikation mit Modulo 10
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

                // Arrayzugriff
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

                let commentText = "";
                if (line.includes("System.out.println") && meta?.idx !== undefined) {
                    commentText = `Gibt die ${meta.idx + 1}. Array-Stelle aus`;
                } else if (line.includes("System.out.println")) {
                    commentText = "Gibt Ausgabe aus";
                } else if (line.includes(`int ${meta?.var} =`)) {
                    commentText = `Variable ${meta.var} = ${meta.val}`;
                } else if (line.includes(`int ${meta?.varA} =`)) {
                    commentText = `Erste Zahl (${meta.a})`;
                } else if (line.includes(`int ${meta?.varB} =`)) {
                    commentText = `Zweite Zahl (${meta.b})`;
                } else if (line.includes("% 10")) {
                    commentText = "Ergebnis mod 10";
                } else if (line.includes("int n =")) {
                    commentText = `n = ${meta.n}`;
                } else if (line.includes("for")) {
                    commentText = "Schleife von 1 bis n";
                } else if (line.includes("+=") && meta?.sumVar) {
                    commentText = `Summe += i`;
                } else if (line.includes("int[]")) {
                    commentText = "Array initialisieren";
                } else if (line.includes("[") && line.includes("]") && meta?.idx !== undefined) {
                    commentText = `Array-Stelle ${meta.idx + 1}`;
                }

                const codePart = line.split("//")[0].trimEnd();
                const padded = codePart.padEnd(40, ' ');
                return padded + `<span style="color: blue; font-style: italic">// ${commentText}</span>`;
            });

            t.do_print_task = () => {
                writer.clear_stage();
                writer.print_html_on_stage(`<pre>${commentedCode.join("\n")}</pre>`);
            };

            t.expected_answer = "" + result;
            t.accepts_answer_function = (given_answer) => ["0","1","2","3","4","5","6","7","8","9"].includes(given_answer);
            t.do_print_error_message = (given_answer) => { writer.clear_error(); writer.print_html_on_error(`<h1>Ungültige Antwort: ${given_answer}</h1>`); };
            t.do_print_after_task_information = () => { writer.clear_error(); writer.print_string_on_stage(writer.convert_string_to_html_string("\n\nFalls du dich unkonzentriert fühlst, mach eine kurze Pause.\n\nDrücke [Enter], um fortzufahren.")); };
        }
    };
};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function)