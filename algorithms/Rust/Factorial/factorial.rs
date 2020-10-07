/*
* author Christian Escolano
* github_id Esci92
*
* Callc Factorial value
*/

fn to_int(_stdin_value: std::io::Stdin) -> i32 {
    use std::io::stdin;

    let mut stdin_value = String::new();
    stdin().read_line(&mut stdin_value).unwrap();
    let n: i32 = stdin_value.trim().parse().unwrap();
    return n
}

fn factorial_recurrent( input_value: i32) -> i32 {
	//Check if exeption 0 is given as input
	if input_value == 0 {

		// Value is 1 for 0
		return 1;
	}

	else {

		// Recurrent calculating Factorial
		return input_value * factorial_recurrent(input_value - 1);
	}
}

fn main()
{
    use std::io::stdin;

	// Variables
	let _input_value : String;
	let input_value_int;
	let result;

	// Get User Input for the Calculation of the Factorialvalue
	println!("Enter the Number to Calculate the Factorialvalue: ");
	let input_value = stdin();

    input_value_int = to_int(input_value);

	// Call function 
	result = factorial_recurrent(input_value_int);

	// Sending the Value
	print!("The Factorial number of {}", input_value_int);
  println!("! is {}", result); 
}