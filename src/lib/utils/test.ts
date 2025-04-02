export async function testFunction(emailTest: string, passwordTest: string) {
    console.log("emailTest", emailTest)
    console.log("passwordTest", passwordTest)

    const response = await fetch("/api/test", {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Test error");
    }

    return response.json();
}