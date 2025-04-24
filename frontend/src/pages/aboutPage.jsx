import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
export default function AboutPage() {
    return (
        <div className="flex min-h-screen w-screen bg-gradient-to-br from-blue-100 to-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-5  h-full">
                    <div className="max-w-5xll h-150  mx-auto bg-white shadow-md shadow-black rounded-lg p-4">
                        <h1 className="text-3xl font-bold mb-4 text-blue-600">About FitDash</h1>
                        <p className="text-gray-700 text-lg mb-6">
                            <strong>FitDash</strong> is your all-in-one health companion designed to help you monitor your calories, manage your water intake, and get smart suggestions through AI to lead a healthier life.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-2 text-blue-700">👣 Our Mission</h2>
                                <p className="text-gray-700">
                                    Empower individuals to take charge of their wellness with intelligent, easy-to-use tools that promote daily healthy habits.
                                </p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-2 text-green-700">🔍 Features</h2>
                                <ul className="list-disc list-inside text-gray-700">
                                    <li>Calorie Tracker with visual progress</li>
                                    <li>Water Intake goals and progress</li>
                                    <li>AI-powered health suggestions</li>
                                    <li>Interactive calendar for tracking</li>
                                </ul>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-2 text-purple-700">📈 Why FitDash?</h2>
                                <p className="text-gray-700">
                                    Most fitness apps are either overwhelming or underwhelming. FitDash strikes the perfect balance by being intelligent yet simple, goal-oriented yet stress-free.
                                </p>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-2 text-yellow-700">👨‍💻 Built With</h2>
                                <ul className="list-disc list-inside text-gray-700">
                                    <li>React + Tailwind CSS</li>
                                    <li>Recharts for visuals</li>
                                    <li>React Router DOM</li>
                                    <li>AI suggestion engine (integrated)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} FitDash. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}