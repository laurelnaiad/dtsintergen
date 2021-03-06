import commander from 'commander';

/* tslint:disable:no-var-requires */
const pkg = require('../package.json');
/* tslint:enable:no-var-requires */

export class CommandOptions {
    public files: string[] = [];
    public urls: string[] = [];
    public stdin?: boolean;
    public out?: string;
    public namespace?: string;
    public intersection?: boolean;
    public allDefs?: boolean;

    public isReadFromStdin(): boolean {
        return this.stdin || this.files.length === 0 && this.urls.length === 0;
    }
}


const opts = new CommandOptions();
clear();
export default opts;

export function initialize(argv: string[]): commander.Command {
    return parse(opts, argv);
}

export function clear(): void {
    opts.files = [];
    opts.urls = [];
    opts.stdin = undefined;
    opts.out = undefined;
    opts.namespace = undefined;
    opts.intersection = undefined;
    opts.allDefs = undefined;
}

function parse(o: CommandOptions, argv: string[]): commander.Command {
    const command = new commander.Command();

    function collectUrl(val: string, memo: string[]): string[] {
        memo.push(val);
        return memo;
    }

    // <hoge> is required, [hoge] is optional
    command
        .version(pkg.version)
        .usage('[options] <file ... | file patterns using node-glob>')
        .option('--url <url>', 'input json schema from the url.', collectUrl, [])
        .option('--stdin', 'read stdin with other files or urls.')
        .option('-o, --out <file>', 'output d.ts filename.')
        .option('-n, --namespace <namespace>', 'use root namespace instead of definitions or components.schema from OpenAPI, or -n "" to suppress namespaces.')
        .option('-i, --intersection', 'output intersection types for `allOf` and `anyOf` schema.')
        .option('-a, --allDefs', 'generate output for all `definitions` schema, even those not referenced.')

        .on('--help', () => {
            /* tslint:disable:no-console */
            console.log('');
            console.log('  Examples:');
            console.log('');
            console.log('    $ dtsintergen --help');
            console.log('    $ dtsintergen --out types.d.ts schema/**/*.schema.json');
            console.log('    $ cat schema1.json | dtsintergen');
            console.log('    $ dtsintergen -o swaggerSchema.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json');
            console.log('    $ dtsintergen -o petstore.d.ts -n PetStore --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml');
        })
        .parse(argv);

    const res = command as any;
    o.files = command.args;
    o.urls = res.url;
    o.stdin = res.stdin;
    o.out = res.out;
    o.namespace = res.namespace;
    o.intersection = res.intersection;
    o.allDefs = res.allDefs;
    return command;
}

