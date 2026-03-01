# Contributing Guide

Welcome to the Algorithms repository! We are building a curated, multi-language collection of **248 algorithms** with **2,402 implementations** across **11 languages**, organized by category. Every contribution goes through templates, automated validation, and maintainer review to ensure consistent quality across the entire project.

For more on our project goals, see the [README](README.md).

The maintainer of the project is [Thuvarakan](https://github.com/Thuva4).

---

## Table of Contents

- [Repository Structure](#repository-structure)
- [How to Contribute](#how-to-contribute)
  - [Adding a New Algorithm](#adding-a-new-algorithm)
  - [Adding a Language Implementation to an Existing Algorithm](#adding-a-language-implementation-to-an-existing-algorithm)
- [Code Standards](#code-standards)
  - [File Naming Conventions](#file-naming-conventions)
  - [Implementation Guidelines](#implementation-guidelines)
- [PR Requirements](#pr-requirements)
- [Quality Bar](#quality-bar)
- [Supported Languages](#supported-languages)
- [Categories](#categories)
- [Scaffold Script](#scaffold-script)
- [PR Validation Bot](#pr-validation-bot)
- [Requesting Algorithms or Implementations](#requesting-algorithms-or-implementations)
- [Getting Help](#getting-help)
- [Contributors](#contributors)

---

## Repository Structure

This repository follows a **category-first** organization. Every algorithm lives under its category, and each algorithm directory contains documentation, test cases, and implementations in one or more languages.

```
algorithms/
└── sorting/
    └── bubble-sort/
        ├── README.md
        ├── metadata.yaml
        ├── tests/
        │   └── cases.yaml
        ├── python/
        │   └── bubble_sort.py
        ├── java/
        │   └── BubbleSort.java
        └── ...
```

Each algorithm directory contains:

| File/Directory | Purpose |
|---|---|
| `README.md` | Educational explanation of the algorithm (overview, steps, complexity, use cases) |
| `metadata.yaml` | Structured metadata (name, category, complexity, tags, related algorithms) |
| `tests/cases.yaml` | Test cases with inputs and expected outputs (minimum 5, including edge cases) |
| `{language}/` | One subdirectory per language implementation |

---

## How to Contribute

### Adding a New Algorithm

1. **Check if the algorithm already exists.**
   Browse the `algorithms/` directory or search the README table to make sure the algorithm has not already been added.

2. **Fork the repository and create a branch.**
   ```bash
   git checkout -b add/{category}/{algorithm-slug}
   ```

3. **Scaffold the algorithm directory.**
   Use the scaffold script to generate all boilerplate:
   ```bash
   npm run scaffold -- --name "Algorithm Name" --slug algorithm-slug --category sorting --difficulty intermediate
   ```
   This creates the full directory structure with template files for `metadata.yaml`, `README.md`, `tests/cases.yaml`, and empty directories for all 11 languages.

4. **Fill in `metadata.yaml`.**
   Copy the template from [`templates/metadata-template.yaml`](templates/metadata-template.yaml) and fill in all fields:
   - `name` -- Human-readable algorithm name
   - `slug` -- Kebab-case identifier (must match directory name)
   - `category` -- One of the [14 supported categories](#categories)
   - `subcategory` -- More specific grouping (optional)
   - `difficulty` -- `beginner`, `intermediate`, or `advanced`
   - `tags` -- Searchable keywords
   - `complexity` -- Time (best, average, worst) and space in Big-O notation
   - `stable` -- Whether the algorithm is stable (`true`, `false`, or `null` if not applicable)
   - `in_place` -- Whether the algorithm operates in place (`true`, `false`, or `null`)
   - `related` -- Slugs of related algorithms
   - `implementations` -- List of languages with implementations
   - `visualization` -- `true` or `false`

5. **Add `README.md`.**
   Copy the template from [`templates/algorithm-readme-template.md`](templates/algorithm-readme-template.md). The README must include all of these sections:
   - Overview
   - How It Works (with a worked example)
   - Pseudocode
   - Complexity Analysis (table with best/average/worst time and space)
   - When to Use / When NOT to Use
   - Comparison with Similar Algorithms
   - References

6. **Add `tests/cases.yaml`.**
   Copy the template from [`templates/test-cases-template.yaml`](templates/test-cases-template.yaml). Requirements:
   - Minimum **5 test cases**
   - Must include edge cases (empty input, single element, etc.)
   - Must define the `function_signature` (name, input types, output type)
   - All implementations must match this signature

7. **Add at least one language implementation.**
   Create a subdirectory for the language (e.g., `python/`) and add your implementation file following the [file naming conventions](#file-naming-conventions). The function must match the signature defined in `tests/cases.yaml`.

8. **Run validation.**
   ```bash
   node scripts/validate-structure.mjs
   ```
   Fix any errors before submitting.

9. **Submit a pull request.**
   Follow the [PR requirements](#pr-requirements) below.

### Adding a Language Implementation to an Existing Algorithm

1. **Find the algorithm directory.**
   Navigate to `algorithms/{category}/{algorithm-slug}/`.

2. **Read the existing `tests/cases.yaml`.**
   Understand the function signature and all test cases your implementation must pass.

3. **Create the language subdirectory.**
   ```bash
   mkdir algorithms/{category}/{algorithm-slug}/{language}
   ```

4. **Implement the algorithm.**
   - The function name and signature must match what is defined in `tests/cases.yaml`.
   - Your implementation must pass all test cases.
   - Follow the [file naming conventions](#file-naming-conventions) and [code standards](#implementation-guidelines).

5. **Update `metadata.yaml`.**
   Add your language to the `implementations` list.

6. **Submit a pull request.**

---

## Code Standards

### File Naming Conventions

Each language has its own convention. Use the table below:

| Language | Convention | Example |
|---|---|---|
| Python | `snake_case.py` | `bubble_sort.py` |
| Java | `PascalCase.java` | `BubbleSort.java` |
| C++ | `snake_case.cpp` | `bubble_sort.cpp` |
| C | `snake_case.c` | `bubble_sort.c` |
| Go | `snake_case.go` | `bubble_sort.go` |
| TypeScript | `camelCase.ts` | `bubbleSort.ts` |
| Kotlin | `PascalCase.kt` | `BubbleSort.kt` |
| Rust | `snake_case.rs` | `bubble_sort.rs` |
| Swift | `PascalCase.swift` | `BubbleSort.swift` |
| Scala | `PascalCase.scala` | `BubbleSort.scala` |
| C# | `PascalCase.cs` | `BubbleSort.cs` |

### Implementation Guidelines

- **Match the function signature** defined in `tests/cases.yaml` exactly.
- **Write idiomatic code** for the language (e.g., use Pythonic patterns in Python, proper error handling in Rust, etc.).
- **Document your code** with clear comments explaining the logic and key steps.
- **Include standard optimizations** where applicable (e.g., early termination in bubble sort when no swaps occur in a pass).
- **Keep it clean** -- no dead code, no debugging statements, consistent formatting.

---

## PR Requirements

All pull requests must meet the following criteria before they will be merged:

1. **Structure validation passes.** Run `node scripts/validate-structure.mjs` and ensure zero errors.
2. **All test cases pass** for every submitted implementation.
3. **`README.md` follows the template** with all required sections filled in.
4. **`metadata.yaml` is complete and accurate** -- all fields populated, complexity values correct.
5. **Maintainer review required.** Every PR is reviewed by a maintainer before merging. Expect feedback on code quality, documentation clarity, and test coverage.

---

## Quality Bar

This is a curated repository. We hold contributions to a high standard:

- **Implementations must be idiomatic** for their language. A Java solution should look like good Java, not transliterated Python.
- **Test cases must cover edge cases** -- empty inputs, single elements, already-sorted data, negative numbers, large inputs, duplicates, and any other boundary conditions relevant to the algorithm.
- **Documentation must be educational and accurate.** The README should teach someone how the algorithm works, not just describe it. Complexity analysis must be correct and explained.

---

## Supported Languages

This project accepts implementations in the following 11 languages:

1. Java
2. Python
3. C
4. C++
5. Go
6. TypeScript
7. Kotlin
8. Rust
9. Swift
10. Scala
11. C#

---

## Categories

All algorithms are organized into one of the following 14 categories:

| Category | Description |
|---|---|
| `sorting` | Algorithms that arrange elements in a specific order |
| `searching` | Algorithms for finding elements or values within data structures |
| `graph` | Algorithms operating on graph structures (traversal, shortest path, MST, etc.) |
| `dynamic-programming` | Optimization problems solved by breaking them into overlapping subproblems |
| `trees` | Algorithms for tree data structures (traversal, balancing, construction) |
| `strings` | String matching, manipulation, and parsing algorithms |
| `math` | Number theory, combinatorics, arithmetic, and other mathematical algorithms |
| `greedy` | Algorithms that make locally optimal choices at each step |
| `backtracking` | Algorithms that explore all possibilities by building candidates and abandoning those that fail |
| `divide-and-conquer` | Algorithms that break problems into smaller subproblems, solve them independently, and combine results |
| `bit-manipulation` | Algorithms that operate directly on binary representations of numbers |
| `geometry` | Computational geometry algorithms (convex hull, line intersection, etc.) |
| `cryptography` | Encryption, hashing, and other security-related algorithms |
| `data-structures` | Implementations and operations on fundamental data structures |

---

## Scaffold Script

The scaffold script generates all boilerplate for a new algorithm:

```bash
npm run scaffold -- --name "Algorithm Name" --slug algorithm-name --category sorting --difficulty intermediate
```

This creates:
- `algorithms/{category}/{slug}/metadata.yaml` -- Pre-filled with your values
- `algorithms/{category}/{slug}/README.md` -- Template with all required sections
- `algorithms/{category}/{slug}/tests/cases.yaml` -- Template with 5 test case slots
- Empty directories for all 11 languages

Run `npm run scaffold -- --help` for full usage details.

---

## PR Validation Bot

When you open a pull request, a GitHub Action automatically validates any modified algorithm directories. It checks:

- `metadata.yaml` exists with all required fields (name, slug, category, difficulty, complexity)
- `README.md` exists
- `tests/cases.yaml` exists with at least 1 test case
- Category is one of the 14 valid categories
- Difficulty is beginner, intermediate, or advanced

The bot posts a comment on your PR summarizing validation results. Fix any reported errors before requesting review.

---

## Requesting Algorithms or Implementations

If you want to request a new algorithm or a language implementation without contributing code yourself, use the issue templates:

- [Request a new algorithm](https://github.com/Thuva4/Algorithms_Example/issues/new?template=algorithm-request.yml) -- Specify the algorithm name, category, difficulty, and description
- [Request a language implementation](https://github.com/Thuva4/Algorithms_Example/issues/new?template=language-implementation.yml) -- Specify which algorithm needs an implementation in which language

---

## Getting Help

If you have questions or need guidance:

- Open an issue on the [Issues page](https://github.com/Thuva4/Algorithms_Example/issues)
- Check existing issues and pull requests for context
- Review the templates in the [`templates/`](templates/) directory for examples of what is expected

---

## Contributors

Thanks to everyone who has contributed to this repository.

- [Thuvarakan](https://github.com/Thuva4)
- [christianbender](https://github.com/christianbender)
- [octamois](https://github.com/octamois)
- [abdatta](https://github.com/abdatta)
- [Astrophilic](https://github.com/Astrophilic)
- [GayanSandaruwan](https://github.com/GayanSandaruwan)
- [srpurwaha201](https://github.com/srpurwaha201)
- [adityadavera](https://github.com/adityadavera)
- [AtoMc](https://github.com/AtoMc)
- [AbhiTaker](https://github.com/AbhiTaker)
- [youssefAli11997](https://github.com/youssefAli11997)
- [gionuno](https://github.com/gionuno)
- [lavalojan](https://github.com/lavalojan)
- [ldhnam](https://github.com/ldhnam)
- [Sudeepa14](https://github.com/Sudeepa14)
- [zskamljic](https://github.com/zskamljic)
- [gabrielcerteza](https://github.com/gabrielcerteza)
- [sarthak-sopho](https://github.com/sarthak-sopho)
- [Fcmam5](https://github.com/Fcmam5)
- [ErangaD](https://github.com/ErangaD)
- [fenilgandhi](https://github.com/fenilgandhi)
- [Technophile7](https://github.com/Technophile7)
- [r-o-k-u-r-o-u](https://github.com/r-o-k-u-r-o-u)
- [pabe94](https://github.com/pabe94)
- [IshamMohamed](https://github.com/IshamMohamed)
- [maaz93](https://github.com/maaz93)
- [melzareix](https://github.com/melzareix)
- [causztic](https://github.com/causztic)
- [ranjanbinwani](https://github.com/ranjanbinwani)
- [buihaduong](https://github.com/buihaduong)
- [Texla](https://github.com/Texla)
- [prateekpandey14](https://github.com/prateekpandey14)
- [riktimmondal](https://github.com/riktimmondal)
- [C2P1](https://github.com/C2P1)
- [Pritom14](https://github.com/Pritom14)
- [k-alkiek](https://github.com/k-alkiek)
- [Crowton](https://github.com/Crowton)
- [bansalraghav](https://github.com/bansalraghav)
- [tanya-vedi](https://github.com/tanya-vedi)
- [Decoys-out](https://github.com/Decoys-out)
- [xiroV](https://github.com/xiroV)
- [jourdanrodrigues](https://github.com/jourdanrodrigues)
- [vicennial](https://github.com/vicennial)
- [ms10398](https://github.com/ms10398)
- [pratik1998](https://github.com/pratik1998)
- [bituka](https://github.com/bituka)
- [disc](https://github.com/disc)
- [Geokats](https://github.com/Geokats)
- [maddaladivya](https://github.com/maddaladivya)
- [phoebeclarke](https://github.com/phoebeclarke)
- [imiordanov](https://github.com/imiordanov)
- [Samir55](https://github.com/Samir55)
- [Hayaan](https://github.com/Hayaan)
- [vsk4](https://github.com/vsk4)
- [CodeBySid](https://github.com/CodeBySid)
- [nishankbhati](https://github.com/nishankbhati)
- [LegendL3n](https://github.com/LegendL3n)
- [jeroentjo](https://github.com/jeroentjo)
- [alok760](https://github.com/alok760)
- [sachincool](https://github.com/sachincool)
- [ayush9398](https://github.com/ayush9398)
- [sagarkar10](https://github.com/sagarkar10)
- [Haxk20](https://github.com/Haxk20)
- [sagarchoudhary96](https://github.com/sagarchoudhary96)
- [engrravijain](https://github.com/engrravijain)
- [trimble](https://github.com/trimble)
- [bamsarts](https://github.com/bamsarts)
- [Savithri123](https://github.com/Savithri123)
- [amlaanb](https://github.com/amlaanb)
- [Kurolox](https://github.com/Kurolox)
- [DrBanner97](https://github.com/DrBanner97)
- [j3rrywan9](https://github.com/j3rrywan9)
- [adikul30](https://github.com/adikul30)
- [vn17](https://github.com/vn17)
- [Priyansh2](https://github.com/Priyansh2)
- [cielavenir](https://github.com/cielavenir)
- [ChaituVR](https://github.com/ChaituVR)
- [hyerra](https://github.com/hyerra)
- [fabvit86](https://github.com/fabvit86)
- [mekisiel](https://github.com/mekisiel)
- [tushar-dtu](https://github.com/tushar-dtu)
- [AymanASamyM](https://github.com/AymanASamyM)
- [nicktheway](https://github.com/nicktheway)
- [arunpyasi](https://github.com/arunpyasi)
- [Akos Kovacs](https://github.com/plaidshirtakos)
- [AtoMc](https://github.com/AtoMc)
- [robertmihai26](https://github.com/robertmihai26)
- [Gowtham R](https://github.com/gowtham1997)
- [SrGrace](https://github.com/SrGrace)
- [d-grossman](https://github.com/d-grossman)
- [javmonisu](https://github.com/javmonisu)
- [Nikita](https://github.com/j07nikita)
- [PlatanoBailando](https://github.com/PlatanoBailando)
- [lena15n](https://github.com/lena15n)
- [stripedpajamas](https://github.com/stripedpajamas)
- [Renan Vichetti](https://github.com/rvconessa)
- [pranjalrai](https://github.com/pranjalrai)
- [stuxxnet](https://github.com/stuxxnet42)
- [BurnzZ](https://github.com/BurnzZ)
- [FernandaOchoa](https://github.com/FernandaOchoa)
- [npcoder2k14](https://github.com/npcoder2k14)
- [Jaernbrand](https://github.com/Jaernbrand)
- [DiegoVicen](https://github.com/DiegoVicen)
- [Ashwin-Kapes](https://github.com/Ashwin-Kapes)
- [Santhosh Kumar](https://github.com/santhoshsamy29)
- [Judar Lima](https://github.com/judarlima)
- [Jhalaa](https://github.com/jhalaa)
- [Maaz Qureshi](https://github.com/maazsq)
- [Utkarsh](https://github.com/utkarshmani1997)
- [langlk](https://github.com/langlk)
- [Anat Portnoy](https://github.com/Anat-Port)
- [Leandro Nunes - lnfnunes](https://github.com/lnfnunes)
- [syam3526](https://github.com/syam3526)
- [churrizo](https://github.com/churrizo)
- [Aniket Joshi](https://github.com/aniket7joshi)
- [kuldeepdadhich](https://github.com/kuldeepdadhich)
- [HimanshuAwasthi95](https://github.com/HimanshuAwasthi95)
- [Shaon](https://github.com/me-shaon)
- [Chinmay Chandak](https://github.com/CCAtAlvis)
- [Suman Chaurasia](https://github.com/bzero0)
- [Patrick Fischer](https://github.com/patFish)
- [ServinDC](https://github.com/ServinDC)
- [Piersdb](https://github.com/piersdb)
- [Irshad Ismayil](https://github.com/irshadshalu)
- [BrianChen](https://github.com/brianchen)
- [S Ramakrishnan](https://github.com/sramakrishnan247)
- [Atalanttore](https://github.com/Atalanttore)
- [Anto26](https://github.com/Anto26)
- [p-avital](https://github.com/p-avital)
- [neddstarkk](https://github.com/neddstarkk)
- [h3r0complex](https://github.com/h3r0complex)
- [vzsky](https://github.com/vzsky)
- [raphaelmeyer](https://github.com/raphaelmeyer)
- [jonasbn](https://github.com/jonasbn)
- [Aman Kumar](https://github.com/aman-ku)
- [Esci92](https://github.com/Esci92)
- [ir2010](https://github.com/ir2010)
- [Cc618](https://github.com/Cc618)
- [Md Azharuddin](https://github.com/azhar1038)
- [Jatin7385](https://github.com/Jatin7385)
- [Rhuancpq](https://github.com/Rhuancpq)
- [Omkarnath](https://github.com/pomkarnath98)
