import java.util.Scanner;
import java.text.DecimalFormat;
import java.util.Random;

public class MathClassDemo {
	public static void main(String[] args) {
		
        DecimalFormat fmt = new DecimalFormat("0.##"); // create a DecimalFormat object to format numbers using the new constructor 
        // 0.## means at least 1 digit before the decimal; if integer part is zero, 0 is printed; 
        // and rounded up to two digits after the decimal; trailing zeros aren't printed
		
		// user input: elevation change and trail length
		Scanner input = new Scanner(System.in);
		System.out.print("Enter the elevation change (feet, can be negative): ");
		double elevationChange = input.nextDouble();
		System.out.print("Enter the trail length (miles): ");
		double trailLength = input.nextDouble();
		
		Random rand = new Random(); // create an object of the Random class and store its reference in rand
        int hikers = rand.nextInt(5) + 1; // nextInt(5) generates a random integer between [0, 4], so we have a random number of hikers between 1 and 5
        float weatherFactor = rand.nextFloat(); // nextFloat() generates a random float in [0, 1)
        double adjustedTrailLength = trailLength + weatherFactor;

		// Math class calculations
        // We use Math the class name to call the following (static) methods
		double totalClimb = Math.abs(elevationChange);  // Math.abs(): return the absolute value
		double effortScore = Math.sqrt(adjustedTrailLength * totalClimb); // Math.sqrt(): return the square root of a value
		double estimatedCalories = Math.pow(adjustedTrailLength, 1.5); // Math.pow(double base, double exponent): raise a base to a power (exponent)

		// Display formatted results
        System.out.println("Total climb (ft): " + fmt.format(totalClimb));
        System.out.println("Number of hikers: " + fmt.format(hikers));
        System.out.println("Effort score: " + fmt.format(effortScore));
        System.out.println("Estimated calories burned: " + fmt.format(estimatedCalories));
        
        // Display non-formatted total climb
        System.out.println("Total climb (ft, non-formatted): " + totalClimb); // totalClimb isn't changed by the DecimalFormat object referenced by fmt
	}
}
