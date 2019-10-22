<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PicsRepository")
 */
class Pics
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"product", "variant"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"product", "variant"})
     */
    private $b64;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getB64(): ?string
    {
        return $this->b64;
    }

    public function setB64(string $b64): self
    {
        $this->b64 = $b64;

        return $this;
    }
}
