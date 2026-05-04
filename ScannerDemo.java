import java.util.Scanner;

public class ScannerDemo {
	public static void main(String[] args) {
	
	Scanner input = new Scanner(System.in);
	
	/*// Demo next()
	System.out.print("Enter something: ");
	String value = input.next();
	System.out.println(value); */

	System.out.print("Enter your age: ");
	int age = input.nextInt();
	
	System.out.print("Enter your hours spent on CIS606: ");
	double hours = input.nextDouble();
	// input.nextLine();   // uncomment this line to use an extra nextLine() to consume the leftover newline

	System.out.print("Enter your name: ");
	String name = input.nextLine();  // potential problem here if input.nextLine(); is commented out
	
	/* use nextLine() when reading text;
	   use nextInt() / nextDouble() when reading numbers
 	   after reading a number, always call nextLine() before reading text */
	
	System.out.println("Name: " + name);
	System.out.println("Age: " + age);
	System.out.println("Hours spent on CIS606: " + hours);
	}

}
