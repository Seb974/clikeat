<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ORM\Entity(repositoryClass="App\Repository\NutritionalsRepository")
 * @ApiResource
 */
class Nutritionals
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"product", "variant"})
     */
    private $id;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"product", "variant"})
     */
    private $kJ;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"product", "variant"})
     */
    private $kCal;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"product", "variant"})
     */
    private $protein;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"product", "variant"})
     */
    private $carbohydrates;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"product", "variant"})
     */
    private $sugar;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"product", "variant"})
     */
    private $fat;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"product", "variant"})
     */
    private $transAG;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"product", "variant"})
     */
    private $salt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getKJ(): ?float
    {
        return $this->kJ;
    }

    public function setKJ(float $kJ): self
    {
        $this->kJ = $kJ;

        return $this;
    }

    public function getKCal(): ?float
    {
        return $this->kCal;
    }

    public function setKCal(?float $kCal): self
    {
        $this->kCal = $kCal;

        return $this;
    }

    public function getProtein(): ?float
    {
        return $this->protein;
    }

    public function setProtein(float $protein): self
    {
        $this->protein = $protein;

        return $this;
    }

    public function getCarbohydrates(): ?float
    {
        return $this->carbohydrates;
    }

    public function setCarbohydrates(float $carbohydrates): self
    {
        $this->carbohydrates = $carbohydrates;

        return $this;
    }

    public function getSugar(): ?float
    {
        return $this->sugar;
    }

    public function setSugar(float $sugar): self
    {
        $this->sugar = $sugar;

        return $this;
    }

    public function getFat(): ?float
    {
        return $this->fat;
    }

    public function setFat(float $fat): self
    {
        $this->fat = $fat;

        return $this;
    }

    public function getTransAG(): ?float
    {
        return $this->transAG;
    }

    public function setTransAG(float $transAG): self
    {
        $this->transAG = $transAG;

        return $this;
    }

    public function getSalt(): ?float
    {
        return $this->salt;
    }

    public function setSalt(float $salt): self
    {
        $this->salt = $salt;

        return $this;
    }
}
