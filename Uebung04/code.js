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
            const randNum = () => random_int(5) + 5;

            const generateNoiseBlock = () => [
                `// nicht relevant`,
                `int ${v.dummy} = 0;                                      // nicht relevant`,
                `for (int ${v.temp} = 0; ${v.temp} < 3; ${v.temp}++) {   // nicht relevant`,
                `    if (${v.temp} % 2 == 0) {`,
                `        ${v.dummy} += ${v.temp};                        // nicht relevant`,
                `    } else {`,
                `        ${v.dummy} -= ${v.temp};                        // nicht relevant`,
                `    }`,
                `}`,
            ];

            const variantName = t.treatment_combination[1].value;
            const addComment = t.treatment_combination[0].value === "mitKommentar";

            const codeVariants = {
                Rekursion: () => {
                    const val = randNum();
                    const fib = [0, 1];
                    for (let i = 2; i <= val; i++) {
                        fib.push(fib[i - 1] + fib[i - 2]);
                    }
                    const res = fib[val] % 10;

                    return {
                        code: [
                            `int ${v.func}(int ${v.v1}, int[] ${v.array}) {`,
                            `    int noise = 0;                                      // nicht relevant`,
                            `    for (int i = 0; i < 2; i++) {                      // Schleife läuft 2-mal (i=0,1)`,
                            `        noise += i;                                    // nicht relevant`,
                            `    }`,
                            `    if (${v.v1} < ${v.array}.length && ${v.array}[${v.v1}] != -1) {`,
                            `        return ${v.array}[${v.v1}];                    // Prüft, ob Ergebnis schon berechnet wurde`,
                            `    }`,
                            `    if (${v.v1} <= 1) {`,
                            `        return ${v.v1};                                 // Basisfall der Rekursion`,
                            `    }`,
                            `    ${v.array}[${v.v1}] = ${v.func}(${v.v1} - 1, ${v.array}) + ${v.func}(${v.v1} - 2, ${v.array}); // Start der Rekursion`,
                            `    if (${v.v1} % 3 == 0) {`,
                            `        int distract = ${v.v1} * 2;                    // nicht relevant`,
                            `    }`,
                            `    return ${v.array}[${v.v1}];                         // Rückgabe nach Rekursion`,
                            `}`,
                            `int[] ${v.array} = new int[20];`,
                            `for (int i = 0; i < ${v.array}.length; i++) {          // Initialisiert Array mit -1, läuft 20-mal`,
                            `    ${v.array}[i] = -1;`,
                            `}`,
                            `int ${v.v2} = ${val};`,
                            `int temp = 123;                                       // nicht relevant`,
                            `int ${v.result} = ${v.func}(${v.v2}, ${v.array}) % 10;`,
                            ...generateNoiseBlock(),
                            `System.out.println(${v.result});`,
                        ],
                        result: res,
                    };
                },

                NestedLoops: () => {
                    let total = 0;
                    for (let i = 1; i <= 4; i++) {
                        for (let j = 1; j <= 4; j++) {
                            let product = i * j;
                            if (product % 2 === 0 && i !== j && !(i === 2 && j === 2)) {
                                total += i + j;
                            }
                        }
                    }

                    return {
                        code: [
                            `int ${v.result} = 0;`,
                            `boolean ${v.flag} = false;`,
                            `int noiseCounter = 0;                                // nicht relevant`,
                            `for (int ${v.v1} = 1; ${v.v1} <= 4; ${v.v1}++) {    // äußere Schleife läuft 4-mal`,
                            `    for (int ${v.v2} = 1; ${v.v2} <= 4; ${v.v2}++) { // innere Schleife läuft 4-mal ⇒ 16 Durchläufe`,
                            `        int ${v.temp} = ${v.v1} * ${v.v2};`,
                            `        if ((${v.v1} + ${v.v2}) % 7 == 0) {`,
                            `            noiseCounter++;                            // nicht relevant`,
                            `        }`,
                            `        if (${v.temp} % 2 == 0 && ${v.v1} != ${v.v2}) {`,
                            `            if (!(${v.v1} == 2 && ${v.v2} == 2)) {`,
                            `                int sum = ${v.v1} + ${v.v2};`,
                            `                for (int k = 0; k < 1; k++) {         // läuft 1-mal`,
                            `                    sum += 0;                           // nicht relevant`,
                            `                }`,
                            `                ${v.result} += sum;`,
                            `            } else {`,
                            `                ${v.flag} = true;                      // Flag setzen bei (2,2)`,
                            `            }`,
                            `        }`,
                            `    }`,
                            `    if (${v.flag}) {`,
                            `        break;                                       // Schleife abbrechen`,
                            `    }`,
                            `}`,
                            `for (int z = 0; z < 2; z++) {                      // läuft 2-mal`,
                            `    int dummy = z * z;                                 // nicht relevant`,
                            `}`,
                            `System.out.println(${v.result} % 10);`,
                        ],
                        result: total % 10,
                    };
                },

                BoolLogik: () => {
                    const inputs = [true, false, true, true, false];
                    let result = 0;

                    for (let i = 0; i < inputs.length; i++) {
                        const a = inputs[i];
                        const b = inputs[(i + 1) % inputs.length];

                        if ((a && !b) || (!a && b)) {
                            result += i;
                        }

                        if (a && b) {
                            result += 2;
                        }
                    }

                    return {
                        code: [
                            `boolean[] ${v.array} = {true, false, true, true, false};`,
                            `int ${v.result} = 0;`,
                            `int noiseCounter = 0;                                // nicht relevant`,
                            `for (int ${v.v1} = 0; ${v.v1} < ${v.array}.length; ${v.v1}++) { // Schleife läuft 5-mal`,
                            `    boolean a = ${v.array}[${v.v1}];`,
                            `    boolean b = ${v.array}[(${v.v1} + 1) % ${v.array}.length];`,
                            `    if (a == b) {`,
                            `        noiseCounter++;                              // nicht relevant`,
                            `    }`,
                            `    if ((a && !b) || (!a && b)) {`,
                            `        ${v.result} += ${v.v1};`,
                            `    }`,
                            `    if (a && b) {`,
                            `        ${v.result} += 2;`,
                            `    }`,
                            `    boolean distraction = (${v.v1} % 2 == 0);        // nicht relevant`,
                            `}`,
                            `boolean dummyFlag = noiseCounter > 3;`,
                            `if (dummyFlag) {`,
                            `    ${v.result} += 0;                                // nicht relevant`,
                            `}`,
                            `System.out.println(${v.result} % 10);`,
                        ],
                        result: result % 10,
                    };
                }
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