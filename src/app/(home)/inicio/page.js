"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area"
import React, { useEffect, useState, useRef, setOpen } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { ChartContainer } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Area, AreaChart } from "recharts"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const chartDoacoesProdutosDiaConfig = {
  visitors: {
    label: "Visitors",
  },
  doadoresAdicionados: {
    label: "Doadores Adicionados",
    color: "hsl(var(--chart-1))",
  },
  doacoesFeitas: {
    label: "Doacoes Feitas",
    color: "hsl(var(--chart-2))",
  },
}



const ProdutosChartConfig = {
  index1: {
    color: "hsl(var(--chart-1))",
  },
  index2: {
    color: "hsl(var(--chart-2))",
  },
  index3: {
    color: "hsl(var(--chart-3))",
  },
  index4: {
    color: "hsl(var(--chart-4))",
  },
  index5: {
    color: "hsl(var(--chart-5))",
  },
  index6: {
    color: "hsl(var(--chart-6))",
  },
  index7: {
    color: "hsl(var(--chart-7))",
  },
  index8: {
    color: "hsl(var(--chart-8))",
  },
  index9: {
    color: "hsl(var(--chart-9))",
  },
  index10: {
    color: "hsl(var(--chart-10))",
  },
};

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home() {

  const [chartData, setChartData] = useState([])

  const [timeRange, setTimeRange] = React.useState("7d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const [totalProdutos, setTotalProdutos] = useState({})
  const [dadosProdutos, setDadosProdutos] = useState({})


  useEffect(() => {
    console.log(dadosProdutos)
  }, [dadosProdutos])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEstatisticas() {
      try {
        const response = await fetch('/api/estatisticas');
        if (!response.ok) {
          throw new Error('Erro ao buscar estatísticas');
        }

        const data = await response.json();
        console.log(data)

        // Adicionando a propriedade fill com base no índice do produto
        const dadosComFill = data.topProdutos.map((produto, index) => ({
          ...produto,
          quantidade: parseInt(produto.quantidade, 10),
          fill: `var(--color-index${index + 1})`, // Criando a tag fill
        }));

        setTotalProdutos(data.totalProdutos);
        setChartData(data.ultimosTresMeses)
        setDadosProdutos(dadosComFill);
        setLoading(false)
      } catch (error) {
        console.error('Erro na requisição:', error.message);
      }
    }

    fetchEstatisticas();
  }, []);

  const [nomeUsuario, setNomeUsuario] = useState("")

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Verifica se a sessão ainda está carregando ou se não existe
    if (status === "loading") return; // Não faz nada enquanto carrega
    if (!session) {
      router.push("/login");
    } else {
      setNomeUsuario(session.user.name)
    }
  }, [session, status, router]);

  if (status === "loading") {
    return null; // Ou um carregando, enquanto a sessão é carregada
  }

  return (
    <div className="pl-8 pr-8">
      <h1 className="text-4xl  mt-10 mb-10 ml-4">{nomeUsuario != "" ? `👋Olá ${nomeUsuario}` : ""}</h1>

      {loading ?
        <div className="flex justify-between">
          <Skeleton className="w-[500px] h-[393px]"></Skeleton>
          <Skeleton className="w-[740px] h-[393px]"></Skeleton>
        </div>
        :
        <div className="flex justify-between">
          <Card className="flex w-[500px]">
            <CardContent className="flex-1 pb-0 flex">
              <div className="flex-1">
                <h1 className="text-lg mt-3 font-bold">Produtos Mais Doados</h1>
                <ChartContainer
                  config={ProdutosChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={dadosProdutos} dataKey="quantidade" nameKey="nome" innerRadius={60} strokeWidth={5}>
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                  {totalProdutos.toLocaleString()}
                                </tspan>
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                  Produtos no Total
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>

              {/* Legenda à direita */}
              <div className="ml-4 flex flex-col justify-center space-y-2">
                {dadosProdutos.map((produto, index) => {
                  const colorVar = `var(--chart-${(index % 10) + 1})`;
                  return (
                    <div key={produto.nome} className="flex items-center space-x-2">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${colorVar})` }}></span>
                      <span className="text-sm">{produto.nome} ({produto.quantidade})</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>


          <Card className="w-[740px]">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1 text-center sm:text-left">
                <CardTitle className="text-lg">Doações feitas e Doadores Adicionados Por Dia</CardTitle>
                <CardDescription>
                  Mostrando as Doações feitas e os Doadores Adicionados por Dia até 3 meses atrás
                </CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="w-[160px] rounded-lg sm:ml-auto"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Ultimos 3 Meses
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Ultimos 30 dias
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Ultimos 7 dias
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer
                config={chartDoacoesProdutosDiaConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient id="fillDoadoresAdicionados" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-doadoresAdicionados)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-doadoresAdicionados)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillDoacoesFeitas" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-doacoesFeitas)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-doacoesFeitas)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="doacoesFeitas"
                    type=""
                    fill="url(#fillDoacoesFeitas)"
                    stroke="var(--color-doacoesFeitas)"
                    stackId="a"
                  />
                  <Area
                    dataKey="doadoresAdicionados"
                    type=""
                    fill="url(#fillDoadoresAdicionados)"
                    stroke="var(--color-doadoresAdicionados)"
                    stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>



        </div>
      }
    </div>
  )
}