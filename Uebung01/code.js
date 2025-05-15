let SEED = "42";
Nof1.SET_SEED(SEED);

let experiment_configuration_function = (writer) => {
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
            { variable: "CodeFormat", treatments: ["mitKommentar", "ohneKommentar"] }
        ],

        training_configuration: {
            fixed_treatments: [["CodeFormat", "mitKommentar"]],
            can_be_cancelled: false,
            can_be_repeated: false
        },

        repetitions: 10,

        measurement: Nof1.Reaction_time(Nof1.keys(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])),

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

                // Variant 1: Direct output
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

                // Variant 2: Addition with modulo
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

                // Variant 3: Loop sum
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

                // Variant 4: Multiplication + modulo
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

                // Variant 5: Array access
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

                if (line.includes("System.out.println")) {
                    if (meta?.idx !== undefined) return line + `  // Gibt die ${meta.idx + 1}. Stelle des Arrays aus`;
                    return line + "  // Gibt die berechnete Ausgabe aus";
                }
                if (line.includes(`int ${meta?.var} =`)) return line + `  // Variable mit Wert ${meta.val}`;
                if (line.includes(`int ${meta?.varA} =`)) return line + `  // Erste Zahl (${meta.a})`;
                if (line.includes(`int ${meta?.varB} =`)) return line + `  // Zweite Zahl (${meta.b})`;
                if (line.includes("% 10")) return line + `  // Ergebnis modulo 10`;
                if (line.includes("int n =")) return line + `  // n = ${meta.n}, Schleife läuft ${meta.n}×`;
                if (line.includes("for")) return line + `  // Schleife summiert Zahlen von 1 bis n`;
                if (line.includes("+=") && meta?.sumVar) return line + `  // Addiert laufende Zahl zu ${meta.sumVar}`;
                if (line.includes("int[]")) return line + `  // Array mit festen Zahlen`;
                if (line.includes("[") && line.includes("]") && meta?.idx !== undefined)
                    return line + `  // Gibt die ${meta.idx + 1}. Stelle des Arrays aus`;

                return line + "  // Nächster Schritt im Code";
            });

            t.do_print_task = () => {
                writer.clear_stage();
                writer.print_html_on_stage(`<pre>${commentedCode.join("\n")}</pre>`);
            };

            t.expected_answer = "" + result;

            t.accepts_answer_function = (given_answer) => {
                return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(given_answer);
            };

            t.do_print_error_message = (given_answer) => {
                writer.clear_error();
                writer.print_html_on_error(`<h1>Ungültige Antwort: ${given_answer}</h1>`);
            };

            t.do_print_after_task_information = () => {
                writer.clear_error();
                writer.print_string_on_stage(writer.convert_string_to_html_string(
                    "Richtig.\n\nFalls du dich unkonzentriert fühlst, mach eine kurze Pause.\n\nDrücke [Enter], um fortzufahren."
                ));
            };
        }
    };
};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);