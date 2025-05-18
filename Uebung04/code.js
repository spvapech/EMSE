let SEED = "42";
Nof1.SET_SEED(SEED);

const experiment_configuration_function = (writer) => {
    function random_int(max) {
        return Nof1.new_random_integer(max);
    }

    function random_name(options) {
        return options[random_int(options.length)];
    }

    function format_code_lines(codeLines, addComment) {
        const COMMENT_COLUMN = 50;

        const codeWidths = codeLines.map(line => {
            const codeOnly = line.split("//")[0];
            return codeOnly.trimEnd().length;
        });
        const maxCodeWidth = Math.max(...codeWidths, COMMENT_COLUMN);

        return codeLines.map((line) => {
            if (!addComment) {
                return line.split("//")[0].trimEnd();
            }

            const commentIndex = line.indexOf("//");
            if (commentIndex === -1) {
                return line;
            }

            const codePart = line.slice(0, commentIndex).trimEnd();
            const comment = line.slice(commentIndex + 2).trim();
            const indent = line.match(/^\s*/)?.[0] ?? "";
            const fullCode = indent + codePart;

            const paddingLength = Math.max(maxCodeWidth - fullCode.length, 2);
            const padding = " ".repeat(paddingLength);

            const isDistraction = /nicht relevant/i.test(comment);
            const style = isDistraction
                ? "color: red; font-weight: bold; font-style: italic"
                : "color: blue; font-style: italic";

            return `${fullCode}${padding}<span style="${style}">// ${comment}</span>`;
        });
    }

    function generateVarNames() {
        return {
            v1: random_name(["a", "x", "n", "k", "i"]),
            v2: random_name(["b", "y", "j", "m", "p"]),
            v3: random_name(["c", "z", "q", "r", "u"]),
            temp: random_name(["temp", "t", "buffer", "store"]),
            result: random_name(["res", "out", "final", "answer"]),
            dummy: random_name(["unused", "noise", "junk", "irrelevant"]),
            flag: random_name(["flag", "check", "found", "done"]),
            array: random_name(["arr", "nums", "list", "data"]),
            func: random_name(["f", "g", "h", "calc"]),
        };
    }

    return {
        experiment_name: "Java Codeverständnis mit Nof1",
        seed: SEED,

        introduction_pages: writer.stage_string_pages_commands([
            writer.convert_string_to_html_string(
                "Willkommen zum Java-Codeverständnis-Experiment.\n\nBitte nur starten, wenn du konzentriert und motiviert bist.\n\nWechsle bitte in den Vollbildmodus (wahrscheinlich mit [F11])."
            ),
            writer.convert_string_to_html_string(
                "In diesem Test wirst du kleine Java-Codebeispiele sehen. Deine Aufgabe ist es, die Ausgabe des Codes korrekt zu bestimmen.\n\nAntworte mit einer Ziffer von 0 bis 9, je nachdem, was in der letzten Zeile mit `System.out.println(...)` ausgegeben wird."
            ),
            writer.convert_string_to_html_string(
                "Zuerst gibt es ein kurzes Training, danach beginnt die eigentliche Testphase.\n\nDu bekommst Rückmeldung, ob deine Eingabe gültig war, aber keine Korrekturhinweise.\n\nBitte beantworte jede Aufgabe so schnell und genau wie möglich."
            ),
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
            ),
        ],

        layout: [
            { variable: "CodeFormat", treatments: ["mitKommentar", "ohneKommentar"] },
            { variable: "CodeVariante", treatments: ["Rekursion", "NestedLoops", "BoolLogik"] },
        ],

        training_configuration: {
            fixed_treatments: [["CodeFormat", "mitKommentar"]],
            can_be_cancelled: false,
            can_be_repeated: false,
        },

        repetitions: 3,

        measurement: Nof1.Reaction_time(Nof1.keys(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])),

        task_configuration: (t) => {
            const v = generateVarNames();
            const randNum = () => random_int(3) + 3;

            const noise_blocks = [
                () => [
                    `int dummy = 42;                                      // nicht relevant`,
                    `dummy += 1;                                          // nicht relevant`,
                ],
                () => [
                    `String msg = "debug";                                // nicht relevant`,
                    `if (msg.length() > 0) {                              // nicht relevant`,
                    `    msg += "!";                                      // nicht relevant`,
                    `}`,
                ],
                () => [
                    `boolean ${v.flag} = true;                             // nicht relevant`,
                    `if (${v.flag} && false) {                             // nicht relevant`,
                    `    System.out.println("Should not print");          // nicht relevant`,
                    `}`,
                ],
                () => [
                    `for (int zz = 0; zz < 1; zz++) {                      // nicht relevant`,
                    `    int x = zz * 0;                                   // nicht relevant`,
                    `}`,
                ],
                () => [
                    `char c = 'A';                                         // nicht relevant`,
                    `c += 1;                                               // nicht relevant`,
                ],
            ];

            const generateNoiseBlock = () => {
                const selected = noise_blocks.slice();
                const blockCount = 2 + random_int(2);
                const result = [];
                for (let i = 0; i < blockCount; i++) {
                    const index = random_int(selected.length);
                    result.push(...selected.splice(index, 1)[0]());
                }
                return result;
            };

            const variantName = t.treatment_combination[1].value;
            const addComment = t.treatment_combination[0].value === "mitKommentar";

            const codeVariants = {
                Rekursion: () => {
                    const val = 3 + random_int(3); // 3–5
                    const fib = [0, 1];
                    for (let i = 2; i <= val; i++) {
                        fib.push(fib[i - 1] + fib[i - 2]);
                    }
                    const res = fib[val] % 10;

                    return {
                        code: [
                            ...generateNoiseBlock(),
                            `int ${v.func}(int ${v.v1}, int[] ${v.array}) {       // Überprüfen, ob der Wert bereits berechnet und gespeichert wurde`,
                            `    if (${v.v1} < ${v.array}.length && ${v.array}[${v.v1}] != -1) {`,
                            `        return ${v.array}[${v.v1}];                    // // Rückgabe des gespeicherten Werts`,
                            `    }`,
                            `    if (${v.v1} <= 1)  // Basisfälle der Fibonacci-Folge`,
                                    `return ${v.v1};`,
                            `    ${v.array}[${v.v1}] = ${v.func}(${v.v1} - 1, ${v.array}) + ${v.func}(${v.v1} - 2, ${v.array}); // Rekursive Berechnung mit Speicherung des Ergebnisses`,
                            `    return ${v.array}[${v.v1}];`,
                            `}`,
                            `int[] ${v.array} = new int[${val + 2}]; // Index der gewünschten Fibonacci-Zahl`,
                            `for (int i = 0; i < ${val + 1}; i++) {                 // Array zur Speicherung der berechneten Werte`,
                            `    ${v.array}[i] = -1;                                // -1 markiert: noch nicht berechnet`,
                            `}`,
                            `int ${v.result} = ${v.func}(${val}, ${v.array}) % 10;`,
                            ...generateNoiseBlock(),
                            `System.out.println(${v.result});`,
                        ],
                        result: res,
                    };
                },

                NestedLoops: () => {
                    const outer = 1 + random_int(3);
                    const inner = 1 + random_int(3);
                    let total = 0;
                    for (let i = 1; i <= outer; i++) {
                        for (let j = 1; j <= inner; j++) {
                            if (i !== j) total += 1;
                        }
                    }

                    return {
                        code: [
                            `int ${v.result} = 0;`,
                            ...generateNoiseBlock(),
                            `for (int ${v.v1} = 1; ${v.v1} <= ${outer}; ${v.v1}++) {      // äußere Schleife, läuft ${outer} Mal`,
                            `    for (int ${v.v2} = 1; ${v.v2} <= ${inner}; ${v.v2}++) {  // innere Schleife, läuft ${inner} Mal`,
                                                                                        `//Insgesamt ${outer + (outer * inner)} Mal`,
                            `        if (${v.v1} != ${v.v2}) {`,
                            `            ${v.result}++;                                   `,
                            `        }`,
                            `    }`,
                            `}`,
                            ...generateNoiseBlock(),
                            `System.out.println(${v.result});`,
                        ],
                        result: total,
                    };
                },

                BoolLogik: () => {
                    const boolArray = Array.from({ length: 3 }, () => random_int(2) === 1);
                    let result = 0;
                    for (let i = 0; i < boolArray.length; i++) {
                        const a = boolArray[i];
                        const b = boolArray[(i + 1) % boolArray.length];
                        if (a && !b) result++;
                    }

                    const boolStr = boolArray.map(b => b ? "true" : "false").join(", ");

                    return {
                        code: [
                            `boolean[] ${v.array} = {${boolStr}};                // Array mit Zufallswerten`,
                            `int ${v.result} = 0;`,
                            `for (int ${v.v1} = 0; ${v.v1} < ${v.array}.length; ${v.v1}++) { //Zählt true→false-Übergänge zyklisch.`,
                            `    boolean a = ${v.array}[${v.v1}];`,
                            `    boolean b = ${v.array}[(${v.v1} + 1) % ${v.array}.length];`,
                            `    if (a && !b) {`,
                            `        ${v.result}++;`,
                            `    }`,
                            `}`,
                            ...generateNoiseBlock(),
                            `System.out.println(${v.result});`,
                        ],
                        result: result,
                    };
                },
            };

            if (!(variantName in codeVariants)) {
                throw new Error(`Unbekannte Code-Variante: ${variantName}`);
            }

            const { code, result } = codeVariants[variantName]();
            const formattedCode = format_code_lines(code, addComment);

            t.do_print_task = () => {
                writer.clear_stage();
                writer.print_html_on_stage(`<p><strong>Variante:</strong> ${variantName}</p>`);
                writer.print_html_on_stage(`<pre>${formattedCode.join("\n")}</pre>`);
            };

            t.expected_answer = String(result);

            t.accepts_answer_function = (a) =>
                ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(a);

            t.do_print_error_message = (a) => {
                writer.clear_error();
                writer.print_html_on_error(`<h1>Ungültige Antwort: ${a}</h1>`);
            };

            t.do_print_after_task_information = () => {
                writer.clear_error();
                writer.print_string_on_stage(
                    writer.convert_string_to_html_string("\n\nFalls du dich unkonzentriert fühlst, mach eine kurze Pause.\n\nDrücke [Enter], um fortzufahren.")
                );
            };
        },
    };
};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);