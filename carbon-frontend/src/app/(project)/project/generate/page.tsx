export default async function Page() {
    async function generatePortfolio(formData: FormData) {
      'use server'
   
      const generatePortfolioFormData = {
        desiredVolume: formData.get('desiredVolume'),
      }
   
      // mutate data
    }
   
    return (
        <form action={generatePortfolio}>
            <input type="text" name="desiredVolume" />
            <button type="submit" className="border rounded-md mt-5 px-4 py-2 bg-green-700 border-green-300">Generate</button>
        </form>
    )
}
