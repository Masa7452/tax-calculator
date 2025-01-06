'use client'

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

const TaxCalculator = () => {
  const [values, setValues] = useState({
    // 副業関連
    totalIncome: 0,
    expenses: 0,
    businessIncome: 0,
    taxFilingType: 'blue-65', // 青色65万円がデフォルト

    // 給与関連
    salaryAfterDeduction: 0,
    withheldTax: 0,

    // 控除関連
    totalDeductions: 0,
  });

  // 計算結果の状態
  const [results, setResults] = useState({
    totalIncome: 0,
    taxableIncome: 0,
    incomeTax: 0,
    finalTax: 0,
    recoveryTax: 0,
    paymentAmount: 0
  });

  // 申告種別による控除額の取得
  const getDeductionAmount = (type) => {
    switch (type) {
      case 'blue-65': return 650000;  // 青色申告（65万円控除）
      case 'blue-10': return 100000;  // 青色申告（10万円控除）
      case 'white': return 0;         // 白色申告
      default: return 0;
    }
  };

  // 所得税率と控除額のテーブル
  const taxBrackets = [
    { limit: 1950000, rate: 0.05, deduction: 0 },
    { limit: 3300000, rate: 0.10, deduction: 97500 },
    { limit: 6950000, rate: 0.20, deduction: 427500 },
    { limit: 9000000, rate: 0.23, deduction: 636000 },
    { limit: 18000000, rate: 0.33, deduction: 1536000 },
    { limit: 40000000, rate: 0.40, deduction: 2796000 },
    { limit: Infinity, rate: 0.45, deduction: 4796000 }
  ];

  // 入力値の更新ハンドラー
  const handleInputChange = (field, value) => {
    const numValue = value === '' ? 0 : Number(value);
    setValues(prev => ({
      ...prev,
      [field]: numValue,
      businessIncome: field === 'totalIncome' ? numValue - prev.expenses :
                     field === 'expenses' ? prev.totalIncome - numValue :
                     prev.businessIncome
    }));
  };

  // 所得税額の計算
  const calculateIncomeTax = (taxableIncome) => {
    const bracket = taxBrackets.find(b => taxableIncome <= b.limit);
    return Math.floor(taxableIncome * bracket.rate - bracket.deduction);
  };

  // すべての計算を実行
  useEffect(() => {
    // 事業所得（申告種別による控除後）
    const deductionAmount = getDeductionAmount(values.taxFilingType);
    const businessIncomeAfterDeduction = Math.max(0, values.businessIncome - deductionAmount);

    // 総所得金額
    const totalIncome = businessIncomeAfterDeduction + values.salaryAfterDeduction;

    // 課税所得金額
    const taxableIncome = Math.max(0, totalIncome - values.totalDeductions);

    // 所得税額
    const incomeTax = calculateIncomeTax(taxableIncome);

    // 復興特別所得税
    const recoveryTax = Math.floor(incomeTax * 0.021);

    // 納付税額
    const finalTax = incomeTax + recoveryTax;
    const paymentAmount = finalTax - values.withheldTax;

    setResults({
      totalIncome,
      taxableIncome,
      incomeTax,
      finalTax,
      recoveryTax,
      paymentAmount
    });
  }, [values]);

  // 金額のフォーマット
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>確定申告計算ツール</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer">
                    <Info className="h-5 w-5 text-gray-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="font-semibold mb-2">計算の仕組み:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>事業所得 = 総収入 - 必要経費 - 申告種別控除</li>
                    <li>総所得金額 = 事業所得 + 給与所得</li>
                    <li>課税所得金額 = 総所得金額 - 所得控除合計</li>
                    <li>所得税額 = 課税所得金額 × 税率 - 控除額</li>
                    <li>最終納付税額 = (所得税額 + 復興特別所得税) - 源泉徴収税額</li>
                  </ol>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription>
              所得税の計算と確定申告時の納付額を計算します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {/* 副業収入セクション */}
              <AccordionItem value="business">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <span>副業関連の情報</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer">
                          <Info className="h-4 w-4 text-gray-500" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        事業収入から経費を引いた金額に対して、
                        申告方式に応じた控除が適用されます
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="totalIncome">総収入金額</Label>
                      <Input
                        id="totalIncome"
                        type="number"
                        value={values.totalIncome || ''}
                        onChange={(e) => handleInputChange('totalIncome', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expenses">必要経費合計</Label>
                      <Input
                        id="expenses"
                        type="number"
                        value={values.expenses || ''}
                        onChange={(e) => handleInputChange('expenses', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="businessIncome">所得金額（自動計算）</Label>
                      <Input
                        id="businessIncome"
                        type="number"
                        value={values.businessIncome || ''}
                        disabled
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="taxFilingType">申告方式</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-pointer">
                              <Info className="h-4 w-4 text-gray-500" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>申告方式による控除額:</p>
                            <ul className="list-disc list-inside">
                              <li>青色申告（65万円）: 電子申告+電子帳簿</li>
                              <li>青色申告（10万円）: その他の青色申告</li>
                              <li>白色申告: 控除なし</li>
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select
                        value={values.taxFilingType}
                        onValueChange={(value) => setValues(prev => ({...prev, taxFilingType: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue-65">青色申告（65万円控除）</SelectItem>
                          <SelectItem value="blue-10">青色申告（10万円控除）</SelectItem>
                          <SelectItem value="white">白色申告</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 給与所得セクション */}
              <AccordionItem value="salary">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <span>給与所得の情報</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer">
                          <Info className="h-4 w-4 text-gray-500" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        源泉徴収票から給与所得控除後の金額と
                        源泉徴収された所得税額を入力してください
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="salaryAfterDeduction">給与所得控除後の金額</Label>
                      <Input
                        id="salaryAfterDeduction"
                        type="number"
                        value={values.salaryAfterDeduction || ''}
                        onChange={(e) => handleInputChange('salaryAfterDeduction', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="withheldTax">源泉徴収された所得税</Label>
                      <Input
                        id="withheldTax"
                        type="number"
                        value={values.withheldTax || ''}
                        onChange={(e) => handleInputChange('withheldTax', e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 控除セクション */}
              <AccordionItem value="deductions">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <span>所得控除の情報</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer">
                          <Info className="h-4 w-4 text-gray-500" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        基礎控除、社会保険料控除、生命保険料控除、
                        配偶者控除など、すべての所得控除の合計額を
                        入力してください
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="totalDeductions">所得控除の合計額</Label>
                    <Input
                      id="totalDeductions"
                      type="number"
                      value={values.totalDeductions || ''}
                      onChange={(e) => handleInputChange('totalDeductions', e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 計算結果の表示 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CardTitle>計算結果</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer">
                    <Info className="h-5 w-5 text-gray-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold mb-2">税率表:</p>
                  <ul className="text-sm space-y-1">
                    <li>195万円以下: 5%</li>
                    <li>195万円超330万円以下: 10%</li>
                    <li>330万円超695万円以下: 20%</li>
                    <li>695万円超900万円以下: 23%</li>
                    <li>900万円超1,800万円以下: 33%</li>
                    <li>1,800万円超4,000万円以下: 40%</li>
                    <li>4,000万円超: 45%</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-medium">総所得金額：</div>
                <div>{formatCurrency(results.totalIncome)}</div>
                
                <div className="font-medium">課税所得金額：</div>
                <div>{formatCurrency(results.taxableIncome)}</div>
                
                <div className="font-medium">所得税額：</div>
                <div>{formatCurrency(results.incomeTax)}</div>
                
                <div className="font-medium">復興特別所得税（2.1%）：</div>
                <div>{formatCurrency(results.recoveryTax)}</div>
                
                <div className="font-medium">所得税額合計：</div>
                <div>{formatCurrency(results.finalTax)}</div>
                
                <div className="font-medium">源泉徴収税額：</div>
                <div>{formatCurrency(values.withheldTax)}</div>
                
                <div className="font-medium text-lg">確定申告による納付税額：</div>
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(results.paymentAmount)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default TaxCalculator;