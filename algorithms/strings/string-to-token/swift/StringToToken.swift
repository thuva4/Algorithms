import Foundation

func tokenize(_ string: String, _ delimiter: String) -> [String] {
    if string.isEmpty { return [] }
    if delimiter.isEmpty { return [string] }
    return string
        .components(separatedBy: delimiter)
        .filter { !$0.isEmpty }
}
