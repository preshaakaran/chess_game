import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Landing = () => {
    const navigate = useNavigate();

    return <div>
        <div className="pt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex justify-center">
                    <img src={"/chess.png"} className="max-w-96"/>
                </div>

                <div className="flex justify-center flex-col">
                    <div className="flex justify-center">
                    <h1 className="text-4xl font-bold text-white">Play Chess Online</h1>
                    </div>
                    <div className="px-8 py-4 flex justify-center">
                        <Button onClick={() => navigate("/game")}>Play Online</Button>   
                    </div>
                </div>         
            </div>

        </div>
    </div>
}